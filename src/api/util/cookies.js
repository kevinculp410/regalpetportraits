export function setAuthCookie(req, res, userId, maxAgeSeconds = 2592000) {
  try {
    const forwardedProto = (req.headers && (req.headers['x-forwarded-proto'] || req.headers['X-Forwarded-Proto'])) || '';
    const proto = (forwardedProto || (req.protocol || '') || 'https').replace(/:$/, '');
    const isHttps = proto === 'https';

    // Always host-only cookie to avoid cross-domain leakage. Path=/ ensures all routes see it.
    const cookieParts = [
      `uid=${userId}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${maxAgeSeconds}`
    ];
    if (isHttps) cookieParts.push('Secure');

    res.setHeader('Set-Cookie', cookieParts.join('; '));
  } catch (_) {
    // Fallback without Secure if detection fails
    res.setHeader('Set-Cookie', `uid=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`);
  }
}

export function clearAuthCookie(req, res) {
  try {
    const forwardedProto = (req.headers && (req.headers['x-forwarded-proto'] || req.headers['X-Forwarded-Proto'])) || '';
    const proto = (forwardedProto || (req.protocol || '') || 'https').replace(/:$/, '');
    const isHttps = proto === 'https';

    const cookieParts = [
      'uid=',
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=0'
    ];
    if (isHttps) cookieParts.push('Secure');

    res.setHeader('Set-Cookie', cookieParts.join('; '));
  } catch (_) {
    res.setHeader('Set-Cookie', 'uid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  }
}