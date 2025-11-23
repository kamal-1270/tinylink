const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_RlsPD4BXv8Sm@ep-dark-truth-ahgwvnri-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Test connection once at server start
pool.connect()
  .then(() => console.log("✔ PostgreSQL connected"))
  .catch(err => console.error("❌ DB Error:", err));

module.exports = pool;
