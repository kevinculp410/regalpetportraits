export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const isHttps = (process.env.BASE_URL || '').startsWith('https://');
    // Clear cookie by expiring it immediately
    const cookie = `uid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isHttps ? '; Secure' : ''}`;
    res.setHeader('Set-Cookie', cookie);
    return res.json({ success: true });
  } catch (e) {
    console.error('Signout error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
}