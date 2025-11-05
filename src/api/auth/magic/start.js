import { randomBytes } from "crypto";
import { Client } from "pg";
import Mailjet from "node-mailjet";
import { getSiteBase } from "../../util/site.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const u = await pg.query(
      `INSERT INTO pet_portraits.users (id, email, name, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
       RETURNING id, email;`,
      [email, name || null]
    );
    const userId = u.rows[0].id;

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await pg.query(
      `INSERT INTO pet_portraits.login_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)`,
      [token, userId, expiresAt]
    );

    const link = `${getSiteBase(req)}/magic?token=${token}`;

    const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);
    await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_FROM_EMAIL || "no-reply@emailpetportraits.com",
              Name: process.env.MAILJET_FROM_NAME || "Regal Pet Portraits",
            },
            To: [{ Email: email }],
            Subject: "Your Magic Login Link",
            TextPart: `Click to login: ${link}`,
            HTMLPart: `<p>Click to login: <a href="${link}">${link}</a></p>`
          },
        ],
      });

    await pg.end();
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}