function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-api-key");
}

const { neon } = require("@neondatabase/serverless");

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error("Missing DATABASE_URL env");
      return res.status(500).json({ error: "Missing DATABASE_URL" });
    }

    const sql = neon(connectionString);

    const rows = await sql`
      SELECT id, username, bank, rekening, nama, nominal, status, created_at
      FROM withdraws
      ORDER BY created_at DESC;
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error("DB ERROR GET /wd:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
