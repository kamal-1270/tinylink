const express = require('express');
const pool = require('../db');
const router = express.Router();

/* ===========================================================
   CREATE SHORT LINK
=========================================================== */
router.post('/', async (req, res) => {
  const { url, code } = req.body;

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const generatedCode =
    code && code.trim() !== ""
      ? code.trim()
      : Math.random().toString(36).substring(2, 10);

  try {
    const result = await pool.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
      [generatedCode, url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('🔥 INSERT ERROR:', err);

    // Duplicate code
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Code already exists' });
    }

    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

/* ===========================================================
   GET ALL LINKS
=========================================================== */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ===========================================================
   GET STATS FOR ONE LINK
   Example: /api/links/abc123
=========================================================== */
router.get('/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE code = $1',
      [req.params.code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ===========================================================
   DELETE A LINK
=========================================================== */
router.delete('/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM links WHERE code = $1',
      [req.params.code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ===========================================================
   REDIRECT SHORT LINK
   Example: http://localhost:3001/api/links/go/abc123
=========================================================== */
router.get('/go/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT url FROM links WHERE code = $1',
      [req.params.code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Invalid short link');
    }

    // Increase click count (optional)
    await pool.query(
      'UPDATE links SET clicks = clicks + 1 WHERE code = $1',
      [req.params.code]
    );

    res.redirect(result.rows[0].url);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
