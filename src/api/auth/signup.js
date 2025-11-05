import { randomBytes, scryptSync, randomUUID } from "crypto";
import { Client } from "pg";
import Mailjet from "node-mailjet";
import { getSiteBase } from "../util/site.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    if (password.length < 6) return res.status(400).json({ error: "password must be at least 6 characters" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      // Ensure required schema and tables exist (no pgcrypto dependency)
      await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
      await pg.query(`
        CREATE TABLE IF NOT EXISTS pet_portraits.users (
          id UUID PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          password_hash TEXT,
          password_salt TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pg.query(`CREATE INDEX IF NOT EXISTS users_email_idx ON pet_portraits.users(email)`);
      await pg.query(`
        CREATE TABLE IF NOT EXISTS pet_portraits.email_verification_tokens (
          id UUID PRIMARY KEY,
          token TEXT UNIQUE NOT NULL,
          user_id UUID NOT NULL REFERENCES pet_portraits.users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pg.query(`CREATE INDEX IF NOT EXISTS email_verification_tokens_token_idx ON pet_portraits.email_verification_tokens(token)`);
      await pg.query(`CREATE INDEX IF NOT EXISTS email_verification_tokens_user_id_idx ON pet_portraits.email_verification_tokens(user_id)`);

      // Check if user already exists
      const existing = await pg.query(`SELECT id, email_verified FROM pet_portraits.users WHERE email = $1`, [email]);
      if (existing.rowCount > 0) {
        await pg.end();
        if (existing.rows[0].email_verified) {
          return res.status(400).json({ error: "account already exists" });
        } else {
          return res.status(400).json({ error: "account exists but not verified - check your email" });
        }
      }

      // Hash password
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 64).toString("hex");

      // Create user (unverified) — generate UUID app-side to avoid pgcrypto dependency
      const newUserId = randomUUID();
      const userResult = await pg.query(
        `INSERT INTO pet_portraits.users (id, email, name, password_hash, password_salt, email_verified, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, FALSE, NOW(), NOW())
         RETURNING id, email`,
        [newUserId, email, name || null, hash, salt]
      );
      const userId = userResult.rows[0].id;

      // Create email verification token — avoid pgcrypto default by setting id explicitly
      const verificationToken = randomBytes(32).toString("hex");
      const tokenId = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await pg.query(
        `INSERT INTO pet_portraits.email_verification_tokens (id, token, user_id, expires_at) VALUES ($1, $2, $3, $4)`,
        [tokenId, verificationToken, userId, expiresAt]
      );

      // Compose verification link from request (works in prod and local)
      const verificationLink = `${getSiteBase(req)}/verify-email?token=${verificationToken}`;

      // Attempt to send verification email; if it fails, proceed and return the link
      try {
        // Support multiple env var conventions for Mailjet keys
        const mjPublicRaw = process.env.MAILJET_API_KEY 
          || process.env.MJ_APIKEY_PUBLIC 
          || process.env.MAILJET_PUBLIC_KEY;
        const mjPrivateRaw = process.env.MAILJET_SECRET_KEY 
          || process.env.MJ_APIKEY_PRIVATE 
          || process.env.MAILJET_PRIVATE_KEY;

        // Trim to avoid leading/trailing spaces causing 401 auth errors
        const mjPublic = (mjPublicRaw || "").trim();
        const mjPrivate = (mjPrivateRaw || "").trim();

        if (!mjPublic || !mjPrivate) {
          console.warn("Signup: Mailjet keys missing. Set MAILJET_API_KEY/MAILJET_SECRET_KEY or MJ_APIKEY_PUBLIC/MJ_APIKEY_PRIVATE.");
        } else {
          const fromEmail = (process.env.MAILJET_FROM_EMAIL || process.env.ADMIN_EMAIL || "support@regalpetportraits.com").trim();
          const fromName = (process.env.MAILJET_FROM_NAME || "Regal Pet Portraits").trim();
          const replyTo = (process.env.MAILJET_REPLY_TO || process.env.ADMIN_EMAIL || fromEmail).trim();

          const mailjet = Mailjet.apiConnect(mjPublic, mjPrivate);
          await mailjet
            .post("send", { version: "v3.1" })
            .request({
              Messages: [
                {
                  From: { Email: fromEmail, Name: fromName },
                  To: [{ Email: email }],
                  ReplyTo: { Email: replyTo, Name: fromName },
                  Subject: "Verify your email - Regal Pet Portraits",
                  TextPart: `Welcome to Regal Pet Portraits! Please verify your email by clicking: ${verificationLink}`,
                  HTMLPart: `
                    <h2>Welcome to Regal Pet Portraits!</h2>
                    <p>Thank you for creating an account. Please verify your email address to get started.</p>
                    <p><a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Verify Email</a></p>
                    <p>Or copy and paste this link: ${verificationLink}</p>
                    <p>This link will expire in 24 hours.</p>
                  `,
                },
              ],
            });
        }
      } catch (mailErr) {
        console.error("Signup: failed to send verification email:", mailErr?.ErrorMessage || mailErr?.message || mailErr);
      }

      await pg.end();
      return res.json({ 
        success: true, 
        message: "Account created! Please check your email to verify your account.",
        verification_link: verificationLink
      });

    } catch (dbError) {
      await pg.end();
      throw dbError;
    }

  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}