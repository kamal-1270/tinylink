const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// ---------------------- CREATE LINK ----------------------
app.post("/api/links", async (req, res) => {
  try {
    const { url, code } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Generate a code if not provided
    const finalCode =
      code && code.trim() !== ""
        ? code.trim()
        : Math.random().toString(36).substring(2, 8);

    const result = await pool.query(
      "INSERT INTO links (url, code, clicks, last_clicked) VALUES ($1, $2, 0, NULL) RETURNING *",
      [url, finalCode]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "This code is already in use" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- GET ALL LINKS ----------------------
app.get("/api/links", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- STATS (DO NOT INCREASE CLICKS) ----------------------
app.get("/api/links/:code/stats", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- DELETE LINK ----------------------
app.delete("/api/links/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "DELETE FROM links WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- REDIRECT & INCREASE CLICKS ----------------------
// Redirect route → increases clicks
// Stats route (do NOT increment clicks)
// Redirect route → Increases clicks
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Get the original URL
    const result = await pool.query(
      "SELECT url FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Link not found");
    }

    // Increment clicks and update last_clicked
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    // Redirect to the actual URL
    res.redirect(result.rows[0].url);
  } catch (error) {
    res.status(500).send("Server error");
  }
});



// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
