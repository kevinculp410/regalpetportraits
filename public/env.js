// Client env: choose API base depending on where the site is served
// - On localhost:3001 (static preview), point API to the Node server on 3002
// - On other localhost ports, use same-origin
// - In production/static hosting, keep same-origin by returning empty string
(function(){
  try {
    const { origin, hostname, port } = window.location;
    if (hostname === 'localhost') {
      if (port === '3001') {
        window.API_BASE_URL = 'http://localhost:3002';
      } else {
        window.API_BASE_URL = origin; // same-origin for 3002 or other local
      }
    } else {
      window.API_BASE_URL = ''; // same-origin in prod
    }
  } catch (_) {
    window.API_BASE_URL = '';
  }
})();
// Force direct uploads in production to bypass browser S3 CORS/ORB issues
// The server streams to S3, avoiding client-side presigned PUTs
window.USE_LOCAL_UPLOADS = (window.location.hostname === 'localhost') ? false : true;

// Optional: set a Payment Link URL in hosting to bypass API checkout.
// Default empty ensures we never point to test links.
window.PAYMENT_LINK_URL = window.PAYMENT_LINK_URL || '';