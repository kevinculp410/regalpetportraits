import { scryptSync } from "crypto";
import { Client } from "pg";
import { setAuthCookie } from "../util/cookies.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      // Find user
      const u = await pg.query(
        `SELECT id, email, password_hash, password_salt, email_verified FROM pet_portraits.users WHERE email = $1`,
        [email]
      );

      if (!u.rowCount) {
        await pg.end();
        return res.status(401).json({ error: "invalid credentials" });
      }

      const user = u.rows[0];

      // Check if email is verified
      if (!user.email_verified) {
        await pg.end();
        return res.status(401).json({ error: "email not verified - please check your email" });
      }

      // Verify password
      const hash = scryptSync(password, user.password_salt, 64).toString("hex");
      if (hash !== user.password_hash) {
        await pg.end();
        return res.status(401).json({ error: "invalid credentials" });
      }

      // Set authentication cookie (Secure when https)
      setAuthCookie(req, res, user.id);

      await pg.end();
      return res.json({ 
        success: true, 
        message: "signed in successfully",
        user: { id: user.id, email: user.email }
      });

    } catch (dbError) {
      await pg.end();
      throw dbError;
    }

  } catch (e) {
    console.error("Signin error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}