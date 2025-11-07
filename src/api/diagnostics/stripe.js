export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const nodeEnv = process.env.NODE_ENV || 'development';
    const key = (process.env.STRIPE_SECRET_KEY || '').trim();
    const hasKey = !!key;
    const isLiveKey = hasKey && key.startsWith('sk_live_');
    const isTestKey = hasKey && key.startsWith('sk_test_');

    const basePriceId = (process.env.BASE_PRICE_ID || '').trim();
    const upscalePriceId = (process.env.UPSCALE_PRICE_ID || '').trim();
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

    // Do not leak secrets; only report presence and mode
    const report = {
      node_env: nodeEnv,
      stripe_key_present: hasKey,
      stripe_mode: isLiveKey ? 'live' : (isTestKey ? 'test' : 'unknown'),
      base_price_id_present: !!basePriceId,
      upscale_price_id_present: !!upscalePriceId,
      webhook_secret_present: !!webhookSecret,
    };

    return res.json(report);
  } catch (e) {
    console.error('diagnostics_stripe_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}