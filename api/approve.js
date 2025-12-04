import { Pool } from 'pg';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing ID" });

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query("UPDATE wd SET status='approved' WHERE id=$1", [id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
