import { getSiteBase } from "../util/site.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Log the entire request body for debugging
    console.log('=== CHECKOUT SESSION REQUEST ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));

    // Extract and validate required inputs
    const {
      user_id,
      job_id,
      style_id,
      style_name,
      success_url: successUrlRaw,
      cancel_url: cancelUrlRaw,
      customer_email: customerEmailRaw,
      want_upscale,
      pet_file
    } = req.body || {};

    // Log extracted values
    console.log('Extracted values:');
    console.log('- user_id:', user_id);
    console.log('- job_id:', job_id);
    console.log('- style_id:', style_id);
    console.log('- style_name:', style_name);
    console.log('- pet_file:', pet_file);
    console.log('- want_upscale:', want_upscale);

    // Compute safe success/cancel URLs: prefer provided, else derive from request
    let success_url = successUrlRaw;
    let cancel_url = cancelUrlRaw;
    const siteBase = getSiteBase(req);
    try {
      // Validate absolute URLs; if invalid, fall back to site base
      success_url = new URL(successUrlRaw).toString();
    } catch (_) {
      success_url = `${siteBase}/success.html?session_id={CHECKOUT_SESSION_ID}`;
    }
    try {
      cancel_url = new URL(cancelUrlRaw).toString();
    } catch (_) {
      cancel_url = `${siteBase}/upload`;
    }

    // Validate required fields
    if (!user_id || !job_id || !style_id || !style_name || !success_url || !cancel_url) {
      return res.status(400).json({ 
        error: "Missing required fields: user_id, job_id, style_id, style_name, success_url, cancel_url" 
      });
    }

    // Fallback: derive pet_file from DB if not provided
    if (!pet_file && process.env.DATABASE_URL) {
      try {
        const { Client } = await import('pg');
        const pg = new Client({ connectionString: process.env.DATABASE_URL });
        await pg.connect();
        const r = await pg.query(
          `SELECT upload_s3_key, composite_s3_key FROM pet_portraits.jobs WHERE id = $1 LIMIT 1`,
          [job_id]
        );
        await pg.end();
        const key = r.rows?.[0]?.upload_s3_key || r.rows?.[0]?.composite_s3_key || '';
        if (key) {
          // If key already starts with 'uploads/', use as-is; otherwise prefix
          pet_file = key.startsWith('uploads/') ? key : `uploads/${key}`;
          console.log('Derived pet_file from DB:', pet_file);
        }
      } catch (e) {
        console.warn('pet_file DB derivation failed:', e.message);
      }
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    }

    // Constants
    const BASE_PRICE_ID = "price_1SJkV9Clk2skywhOicIr2EWv"; // $9.99 portrait
    const UPSCALE_PRICE_ID = "price_1SLvyXClk2skywhO9vmSgpXu"; // $4.99 add-on

    // Build form-encoded body
    const formData = new URLSearchParams();
    
    // Basic session configuration
    formData.append('mode', 'payment');
    formData.append('success_url', success_url);
    formData.append('cancel_url', cancel_url);
    formData.append('automatic_tax[enabled]', 'true');
    formData.append('client_reference_id', job_id);

    // Metadata for n8n webhook (Checkout Session)
    formData.append('metadata[user_id]', user_id);
    formData.append('metadata[job_id]', job_id);
    formData.append('metadata[style_id]', style_id);
    formData.append('metadata[style_name]', style_name);
    if (pet_file) {
      formData.append('metadata[pet_file]', pet_file);
    }
    formData.append('metadata[want_upscale]', (want_upscale === true || want_upscale === "true") ? 'true' : 'false');

    // Mirror metadata to PaymentIntent for webhook visibility (PaymentIntent events)
    formData.append('payment_intent_data[metadata][user_id]', user_id);
    formData.append('payment_intent_data[metadata][job_id]', job_id);
    formData.append('payment_intent_data[metadata][style_id]', style_id);
    formData.append('payment_intent_data[metadata][style_name]', style_name);
    if (pet_file) {
      formData.append('payment_intent_data[metadata][pet_file]', pet_file);
    }
    formData.append('payment_intent_data[metadata][want_upscale]', (want_upscale === true || want_upscale === "true") ? 'true' : 'false');

    // Debug log to confirm values sent
    console.log('=== STRIPE METADATA CONSTRUCTION ===');
    console.log('Stripe Checkout metadata (preview):', { user_id, job_id, style_id, style_name, pet_file, want_upscale });
    
    // Log the actual formData being sent to Stripe
    console.log('=== FORM DATA BEING SENT TO STRIPE ===');
    const formDataEntries = Array.from(formData.entries());
    formDataEntries.forEach(([key, value]) => {
      if (key.includes('metadata')) {
        console.log(`${key}: ${value}`);
      }
    });

    // Base line item (always included)
    formData.append('line_items[0][price]', BASE_PRICE_ID);
    formData.append('line_items[0][quantity]', '1');

    // Conditional upscale line item
    let lineItemsIncluded = "base";
    if (want_upscale === true || want_upscale === "true") {
      formData.append('line_items[1][price]', UPSCALE_PRICE_ID);
      formData.append('line_items[1][quantity]', '1');
      lineItemsIncluded = "base+upscale";
    }

    // Optional customer email: sanitize and only include if valid by strict regex
    let customer_email = undefined;
    if (typeof customerEmailRaw === 'string') {
      const emailVal = customerEmailRaw.trim();
      const strictEmail = /^([^\s@]+)@([^\s@]+)\.[^\s@]+$/;
      if (emailVal && strictEmail.test(emailVal)) {
        customer_email = emailVal;
      }
    }
    if (customer_email) {
      formData.append('customer_email', customer_email);
    }

    // Make request to Stripe API
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      let errorMsg = "Stripe API error";
      try {
        const errJson = await response.json();
        // Stripe error format: { error: { message: "...", param: "...", type: "..." } }
        errorMsg = (errJson && errJson.error && errJson.error.message) ? errJson.error.message : errorMsg;
        console.error('Stripe API error:', errJson);
      } catch (_) {
        const errorText = await response.text();
        errorMsg = errorText || errorMsg;
        console.error('Stripe API error (text):', errorText);
      }
      return res.status(response.status).json({ 
        error: errorMsg 
      });
    }

    const stripeSession = await response.json();

    // Return compact JSON response
    const result = {
      id: stripeSession.id,
      url: stripeSession.url,
      metadata: {
        user_id,
        job_id,
        style_id,
        style_name,
        pet_file,
        want_upscale: (want_upscale === true || want_upscale === "true") ? 'true' : 'false'
      },
      line_items_included: lineItemsIncluded,
      raw: stripeSession
    };

    return res.json(result);

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
}