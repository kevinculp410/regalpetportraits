import { Client } from "pg";

export default async function handler(req, res) {
  try {
    const { token } = req.query || {};
    if (!token) return res.status(400).send("Missing verification token");

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      // Find valid verification token
      const tokenResult = await pg.query(
        `SELECT evt.token, evt.user_id, evt.expires_at, evt.used, u.email 
         FROM pet_portraits.email_verification_tokens evt 
         JOIN pet_portraits.users u ON u.id = evt.user_id 
         WHERE evt.token = $1`,
        [token]
      );

      if (!tokenResult.rowCount) {
        await pg.end();
        return res.status(400).send("Invalid verification token");
      }

      const tokenRow = tokenResult.rows[0];
      
      if (tokenRow.used) {
        await pg.end();
        return res.status(400).send("Verification token already used");
      }
      
      if (new Date(tokenRow.expires_at) < new Date()) {
        await pg.end();
        return res.status(400).send("Verification token expired");
      }

      // Mark token as used and verify user email
      await pg.query(`UPDATE pet_portraits.email_verification_tokens SET used = TRUE WHERE token = $1`, [token]);
      await pg.query(`UPDATE pet_portraits.users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1`, [tokenRow.user_id]);

      // Set authentication cookie
      const isHttps = (process.env.BASE_URL || '').startsWith('https://');
      const cookie = `uid=${tokenRow.user_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;
      res.setHeader("Set-Cookie", cookie);

      await pg.end();
      
      // Redirect to dashboard with success message
      return res.redirect(302, `${process.env.BASE_URL}/dashboard?verified=true`);
      
    } catch (dbError) {
      await pg.end();
      throw dbError;
    }

  } catch (e) {
    console.error("Email verification error:", e);
    return res.status(500).send("Server error during email verification");
  }
}