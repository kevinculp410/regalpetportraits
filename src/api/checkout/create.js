import Stripe from "stripe";
import { Client } from "pg";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });

    const { job_id, style_id, pet_file, prompt_text, style_name, want_upscale } = req.body || {};
    if (!job_id || !pet_file || !style_id) {
      return res.status(400).json({ error: "job_id, style_id, pet_file required" });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Get user + job + email/name for metadata
    const u = await pg.query(`SELECT id, email, name FROM pet_portraits.users WHERE id = $1`, [userId]);
    const email = u.rows[0]?.email || "";
    const name = u.rows[0]?.name || "";

    // Optional: Update job prompt_text if provided here
    if (prompt_text) {
      await pg.query(`UPDATE pet_portraits.jobs SET prompt_text=$1, updated_at=NOW() WHERE id=$2 AND user_id=$3`, [prompt_text, job_id, userId]);
    }

    await pg.end();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const priceId = process.env.STRIPE_PRICE_ID || ""; // set in .env
    if (!priceId) return res.status(500).json({ error: "missing_price_id" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
      client_reference_id: job_id,
      metadata: {
        user_id: userId,
        job_id,
        style_id: String(style_id),
        style_name: style_name || "",
        user_email: email,
        user_name: name,
        pet_file,
        prompt_text: prompt_text || "",
        want_upscale: (want_upscale === true || want_upscale === "true") ? 'true' : 'false'
      },
      payment_intent_data: {
        metadata: {
          user_id: userId,
          job_id,
          style_id: String(style_id),
          style_name: style_name || "",
          pet_file,
          user_email: email,
          user_name: name,
          prompt_text: prompt_text || "",
          want_upscale: (want_upscale === true || want_upscale === "true") ? 'true' : 'false'
        }
      },
      automatic_tax: { enabled: true },
    });

    return res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}