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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.API_KEY) {
    console.error("Missing API_KEY env");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const id = body && body.id;
  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const connectionString = process.env.DATABASE_URL;
    const sql = neon(connectionString);

    await sql`
      UPDATE withdraws
      SET status = 'approved'
      WHERE id = ${id};
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("DB ERROR POST /approve:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
