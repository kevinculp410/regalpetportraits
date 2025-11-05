import { clearAuthCookie } from "../util/cookies.js";

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    // Clear cookie by expiring it immediately (Secure when https)
    clearAuthCookie(req, res);
    return res.json({ success: true });
  } catch (e) {
    console.error('Signout error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
}