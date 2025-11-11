import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import handler from "./api/auth/magic/start.js";
import verifyHandler from "./api/auth/magic/verify.js";
import signinHandler from "./api/auth/signin.js";
import signupHandler from "./api/auth/signup.js";
import verifyEmailHandler from "./api/auth/verify-email.js";
import createJobHandler from "./api/jobs/create.js";
import listJobsHandler from "./api/jobs/list.js";
import jobPhotoSetHandler from "./api/jobs/photo_set.js";
import jobPhotoStreamHandler from "./api/jobs/photo_get.js";
import jobResultStreamHandler from "./api/jobs/result_get.js";
import jobResultSetHandler from "./api/jobs/result_set.js";
import presignUploadHandler from "./api/uploads/presign.js";
import createCheckoutHandler from "./api/checkout/create.js";
import createCheckoutSessionHandler from "./api/checkout/create_checkout_session.js";
import stylesListHandler from "./api/styles/list.js";
import stylesCreateHandler from "./api/styles/create.js";
import stylesDeleteHandler from "./api/styles/delete.js";
import stylesDeleteAllHandler from "./api/styles/delete_all.js";
import adminLoginHandler from "./api/auth/admin/login.js";
import adminMeHandler from "./api/admin/me.js";
import stylesPreviewHandler from "./api/styles/preview.js";
import adminUsersListHandler from "./api/admin/users/list.js";
import adminJobDeleteHandler from "./api/admin/jobs/delete.js";
import adminJobArchiveHandler from "./api/admin/jobs/archive.js";
import adminJobsArchiveBatchHandler from "./api/admin/jobs/archive_batch.js";
import adminJobsArchiveListHandler from "./api/admin/jobs/archive_list.js";
import adminJobUnarchiveHandler from "./api/admin/jobs/unarchive.js";
import adminSalesListHandler from "./api/admin/sales/list.js";
import authMeHandler from "./api/auth/me.js";
import directUploadHandler from "./api/uploads/direct.js";
import signoutHandler from "./api/auth/signout.js";
import jobViewRedirectHandler from "./api/jobs/view.js";
import contactSendHandler from "./api/contact/send.js";
import forgotPasswordHandler from "./api/auth/forgot-password.js";
import resetPasswordHandler from "./api/auth/reset-password.js";
import adminForgotPasswordHandler from "./api/auth/admin/forgot-password.js";
import stripeWebhookHandler from "./api/stripe/webhook.js";
import stripeDiagnosticsHandler from "./api/diagnostics/stripe.js";
import couponClubJoinHandler from "./api/coupon-club/join.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS: allow all origins in production, and common localhost ports in dev
const isProd = process.env.NODE_ENV === "production";
const allowedOrigins = new Set([
  "http://localhost:3004",
  "http://127.0.0.1:3004",
  "http://localhost:3003",
  "http://127.0.0.1:3003",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:3001",
  "http://127.0.0.1:3001"
]);
app.use(cors({
  origin: function(origin, callback) {
    // Allow same-origin or non-browser requests
    if (!origin) return callback(null, true);
    // In production, allow any origin (served as single origin; avoids blocking)
    if (isProd) return callback(null, true);
    // In dev, allow selected localhost origins (including current server port)
    if (allowedOrigins.has(origin)) return callback(null, true);
    // Fallback: allow other localhost origins to prevent dev-time blocking
    try {
      const u = new URL(origin);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (_) {}
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
// Global OPTIONS handler to satisfy browser CORS preflight in Express 5
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') return next();
  const origin = req.headers.origin;
  let allow = false;
  if (!origin) {
    allow = true;
  } else if (isProd) {
    allow = true;
  } else {
    try {
      const u = new URL(origin);
      if (allowedOrigins.has(origin) || u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
        allow = true;
      }
    } catch (_) {}
  }
  if (!allow) return res.status(403).send('Not allowed by CORS');
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  return res.sendStatus(204);
});
// Handle CORS preflight for all routes in development

app.use(express.json({ limit: '25mb' }));
// front-end env script must be served before static to avoid override
app.get("/env.js", (req, res) => {
  const inferredOrigin = `${req.protocol}://${req.get('host')}`;
  const base = (isProd ? (process.env.API_BASE_URL || inferredOrigin) : inferredOrigin);
  const flag = (process.env.USE_LOCAL_UPLOADS === 'true');
  const paymentLink = process.env.PAYMENT_LINK_URL || '';
  res.type("application/javascript").send(
    `window.API_BASE_URL = "${base}"; window.USE_LOCAL_UPLOADS = ${flag}; window.PAYMENT_LINK_URL = ${JSON.stringify(paymentLink)};`
  );
});

// serve static assets
app.use(express.static("public"));

// Proxy remote images to avoid browser ORB blocking
app.get("/assets/remote", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "url_required" });
    let parsed;
    try { parsed = new URL(url); } catch (_) { return res.status(400).json({ error: "invalid_url" }); }
    const allowedHosts = new Set(["images.unsplash.com", "plus.unsplash.com"]);
    if (!allowedHosts.has(parsed.host)) return res.status(400).json({ error: "domain_not_allowed" });
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: "fetch_failed", status: r.status });
    const ct = r.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", ct);
    if (r.body && typeof r.body.pipe === "function") {
      r.body.pipe(res);
    } else {
      const buf = Buffer.from(await r.arrayBuffer());
      res.send(buf);
    }
  } catch (e) {
    console.error("remote_image_proxy_error", e);
    res.status(500).json({ error: "server_error" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.post("/api/auth/magic/start", (req, res) => handler(req, res));
app.get("/api/auth/magic/verify", (req, res) => verifyHandler(req, res));
app.post("/api/auth/signin", (req, res) => signinHandler(req, res));
app.post("/api/auth/signup", (req, res) => signupHandler(req, res));
app.get("/api/auth/verify-email", (req, res) => verifyEmailHandler(req, res));
app.post("/api/auth/signout", (req, res) => signoutHandler(req, res));
app.post("/api/jobs/create", (req, res) => createJobHandler(req, res));
app.get("/api/jobs", (req, res) => listJobsHandler(req, res));
app.get("/api/jobs/:id/photo", (req, res) => jobPhotoStreamHandler(req, res));
app.get("/api/jobs/:id/result", (req, res) => jobResultStreamHandler(req, res));
app.get("/api/jobs/:id/view", (req, res) => jobViewRedirectHandler(req, res));
app.post("/api/jobs/:id/photo", (req, res) => jobPhotoSetHandler(req, res));
app.post("/api/jobs/:id/result", (req, res) => jobResultSetHandler(req, res));
app.post("/api/uploads/presign", (req, res) => presignUploadHandler(req, res));
app.post("/api/checkout/create", (req, res) => createCheckoutHandler(req, res));
app.post("/api/checkout/create_checkout_session", (req, res) => createCheckoutSessionHandler(req, res));
app.get("/api/styles", (req, res) => stylesListHandler(req, res));
app.post("/api/styles", (req, res) => stylesCreateHandler(req, res));
app.delete("/api/styles/:id", (req, res) => stylesDeleteHandler(req, res));
app.post("/api/styles/delete-all", (req, res) => stylesDeleteAllHandler(req, res));
app.get("/api/styles/:id/preview", (req, res) => stylesPreviewHandler(req, res));
app.post("/api/auth/admin/login", (req, res) => adminLoginHandler(req, res));
app.get("/api/admin/me", (req, res) => adminMeHandler(req, res));
app.get("/api/auth/me", (req, res) => authMeHandler(req, res));
app.get("/api/admin/users", (req, res) => adminUsersListHandler(req, res));
app.get("/api/admin/sales/list", (req, res) => adminSalesListHandler(req, res));
app.delete("/api/admin/jobs/:id", (req, res) => adminJobDeleteHandler(req, res));
app.post("/api/admin/jobs/:id/archive", (req, res) => adminJobArchiveHandler(req, res));
app.post("/api/admin/jobs/archive-batch", (req, res) => adminJobsArchiveBatchHandler(req, res));
app.get("/api/admin/jobs/archive-list", (req, res) => adminJobsArchiveListHandler(req, res));
app.post("/api/admin/jobs/:id/unarchive", (req, res) => adminJobUnarchiveHandler(req, res));
app.post("/api/uploads/direct", express.raw({ type: '*/*', limit: '25mb' }), (req, res) => directUploadHandler(req, res));
app.post("/api/contact/send", (req, res) => contactSendHandler(req, res));
app.post("/api/coupon-club/join", (req, res) => couponClubJoinHandler(req, res));
app.post("/api/auth/forgot-password", (req, res) => forgotPasswordHandler(req, res));
app.post("/api/auth/admin/forgot-password", (req, res) => adminForgotPasswordHandler(req, res));
app.post("/api/auth/reset-password", (req, res) => resetPasswordHandler(req, res));
// Stripe webhook requires raw body for signature verification
app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), (req, res) => stripeWebhookHandler(req, res));
// Diagnostics: Stripe env presence and mode (no secrets)
app.get("/api/diagnostics/stripe", (req, res) => stripeDiagnosticsHandler(req, res));
// front-end env script moved above static

// Simple ping to validate /api routing
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// Dev-only: expose selected env values to sync with production
  if (process.env.NODE_ENV !== 'production') {
    app.get("/api/dev/env", (req, res) => {
      try {
        const keys = [
          'DATABASE_URL',
          'S3_BUCKET',
          'AWS_REGION',
          'AWS_ACCESS_KEY_ID',
          'AWS_SECRET_ACCESS_KEY',
          'MAILJET_API_KEY',
          'MAILJET_SECRET_KEY',
          'API_BASE_URL',
          'ADMIN_EMAIL',
        ];
        const env = {};
        keys.forEach(k => { env[k] = process.env[k] || null; });
        res.json({ env });
      } catch (e) {
        res.status(500).json({ error: 'dev_env_export_failed' });
      }
    });
  }

// page routes (SPA): always serve index.html
app.get(["/", "/signin", "/reset-password", "/styles", "/upload", "/coupon-club", "/checkout", "/checkout/success", "/dashboard", "/faqs", "/photo-guide", "/contact", "/admin", "/admin/styles", "/admin/users", "/admin/jobs", "/admin/account", "/admin/archive", "/verify-email", "/admin/reset", "/admin/sales"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Debug: list registered routes
app.get("/debug/routes", (req, res) => {
  try {
    const routes = [];
    const stack = app && app._router && app._router.stack ? app._router.stack : [];
    stack.forEach(m => {
      if (m.route) {
        const methods = Object.keys(m.route.methods).filter(Boolean).map(x => x.toUpperCase()).join(",");
        routes.push(`${methods} ${m.route.path}`);
      }
    });
    res.json({ routes });
  } catch (e) {
    res.status(500).json({ error: "debug_routes_failed" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT || 3001}`);
});