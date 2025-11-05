import Stripe from "stripe";
import { Client } from "pg";

export default async function handler(req, res) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  let event;
  try {
    const sig = req.headers['stripe-signature'];
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Dev fallback: accept JSON without signature (for local testing)
      const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body || {});
      event = JSON.parse(raw || '{}');
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err?.message || err);
    return res.status(400).json({ error: "invalid_signature" });
  }

  // Helper to persist dollar amount to jobs table
  async function setJobAmount(jobId, amountDollars) {
    const amt = Number(amountDollars || 0);
    if (!jobId || !amt || amt <= 0) return false;
    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    try {
      const r = await pg.query(
        `UPDATE pet_portraits.jobs SET amount_cents = $1, updated_at = NOW() WHERE id = $2`,
        [amt, jobId]
      );
      return r.rowCount > 0;
    } catch (e) {
      console.error("JOB_AMOUNT_UPDATE_FAILED", e);
      return false;
    } finally {
      await pg.end();
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object || {};
        const jobId = session.client_reference_id || session.metadata?.job_id || null;
        const amountCents = session.amount_total || 0; // Stripe sends cents
        const amountDollars = Number(amountCents) / 100.0;
        const ok = await setJobAmount(jobId, amountDollars);
        if (!ok) console.warn("Checkout session completed: amount not set (jobId or amount missing)", { jobId, amountCents, amountDollars });
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data?.object || {};
        const jobId = (pi.metadata && (pi.metadata.job_id || pi.metadata.client_reference_id)) || null;
        const amountCents = pi.amount_received || pi.amount || 0; // Stripe cents
        const amountDollars = Number(amountCents) / 100.0;
        const ok = await setJobAmount(jobId, amountDollars);
        if (!ok) console.warn("PaymentIntent succeeded: amount not set (jobId or amount missing)", { jobId, amountCents, amountDollars });
        break;
      }
      default:
        // Ignore other event types
        break;
    }
    return res.json({ received: true });
  } catch (e) {
    console.error("Stripe webhook handling error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}