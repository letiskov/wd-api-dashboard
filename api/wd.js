import { Pool } from 'pg';

export default async function handler(req, res) {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    const result = await pool.query('SELECT * FROM wd ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
