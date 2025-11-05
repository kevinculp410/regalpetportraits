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

window.USE_LOCAL_UPLOADS = false;