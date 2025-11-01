import { Client } from "pg";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const result = await pg.query(`
      SELECT id, title, description, preview_url, sort_order, original_filename
      FROM pet_portraits.styles 
      WHERE is_active = TRUE 
      ORDER BY sort_order ASC, created_at DESC
    `);

    await pg.end();

    return res.json({ 
      data: result.rows,
      count: result.rowCount 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}