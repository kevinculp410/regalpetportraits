export function getSiteBase(req) {
  try {
    const envBase = (process.env.BASE_URL || '').trim();
    const isLocalEnv = /localhost|127\.0\.0\.1/i.test(envBase);

    const forwardedProto = (req.headers && (req.headers['x-forwarded-proto'] || req.headers['X-Forwarded-Proto'])) || '';
    const forwardedHost = (req.headers && (req.headers['x-forwarded-host'] || req.headers['X-Forwarded-Host'])) || '';
    const hostHeader = forwardedHost || (req.get && req.get('host')) || process.env.VERCEL_URL || '';

    const proto = (forwardedProto || (req.protocol || '') || 'https').replace(/:$/, '');
    let base = (!envBase || isLocalEnv) ? (hostHeader ? `${proto}://${hostHeader}` : '') : envBase;

    // Fallback to known production domain if we still couldn't resolve
    if (!base) base = 'https://www.regalpetportraits.com';

    // Normalize and strip trailing segments we don't want
    base = base.replace(/\/$/, '');
    base = base.replace(/\/api\/?$/, '');
    return base;
  } catch (_) {
    return 'https://www.regalpetportraits.com';
  }
}