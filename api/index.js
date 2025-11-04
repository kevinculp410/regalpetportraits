import express from "express";
import cors from "cors";

// API route handlers (reuse existing implementation under src/api/*)
// Use lazy imports inside route handlers to avoid crashing cold starts

// If you have more routes in src/api/* add them here similarly

const app = express();

// Parse JSON for most API endpoints; add urlencoded for form posts
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Same-origin on Vercel, so CORS is permissive or unnecessary; keep simple
app.use(cors());

// Health check
app.get("/api/ping", (req, res) => res.json({ ok: true, pong: true }));
app.get("/api/diagnostics/s3", async (req, res) => {
  const mod = await import("../src/api/diagnostics/s3.js");
  return mod.default(req, res);
});

// Contact
app.post("/api/contact/send", async (req, res) => {
  const mod = await import("../src/api/contact/send.js");
  return mod.default(req, res);
});

// Auth
app.post("/api/auth/magic/start", async (req, res) => (await import("../src/api/auth/magic/start.js")).default(req, res));
app.post("/api/auth/signup", async (req, res) => (await import("../src/api/auth/signup.js")).default(req, res));
app.post("/api/auth/signin", async (req, res) => (await import("../src/api/auth/signin.js")).default(req, res));
app.post("/api/auth/signout", async (req, res) => (await import("../src/api/auth/signout.js")).default(req, res));
app.get("/api/auth/verify-email", async (req, res) => (await import("../src/api/auth/verify-email.js")).default(req, res));
app.get("/api/auth/me", async (req, res) => (await import("../src/api/auth/me.js")).default(req, res));
app.post("/api/auth/forgot-password", async (req, res) => (await import("../src/api/auth/forgot-password.js")).default(req, res));
app.post("/api/auth/reset-password", async (req, res) => (await import("../src/api/auth/reset-password.js")).default(req, res));
app.post("/api/auth/admin/login", async (req, res) => (await import("../src/api/auth/admin/login.js")).default(req, res));
app.get("/api/admin/me", async (req, res) => (await import("../src/api/admin/me.js")).default(req, res));

// Styles
app.get("/api/styles", async (req, res) => (await import("../src/api/styles/list.js")).default(req, res));
app.get("/api/styles/:id/preview", async (req, res) => (await import("../src/api/styles/preview.js")).default(req, res));

// Admin
app.get("/api/admin/users", async (req, res) => (await import("../src/api/admin/users/list.js")).default(req, res));
app.get("/api/admin/sales/list", async (req, res) => (await import("../src/api/admin/sales/list.js")).default(req, res));
app.delete("/api/admin/jobs/:id", async (req, res) => (await import("../src/api/admin/jobs/delete.js")).default(req, res));
app.post("/api/admin/jobs/:id/archive", async (req, res) => (await import("../src/api/admin/jobs/archive.js")).default(req, res));
app.post("/api/admin/jobs/archive-batch", async (req, res) => (await import("../src/api/admin/jobs/archive_batch.js")).default(req, res));
app.get("/api/admin/jobs/archive-list", async (req, res) => (await import("../src/api/admin/jobs/archive_list.js")).default(req, res));
app.post("/api/admin/jobs/:id/unarchive", async (req, res) => (await import("../src/api/admin/jobs/unarchive.js")).default(req, res));

// Jobs
app.get("/api/jobs", async (req, res) => (await import("../src/api/jobs/list.js")).default(req, res));
app.post("/api/jobs/create", async (req, res) => (await import("../src/api/jobs/create.js")).default(req, res));
app.get("/api/jobs/:id/photo", async (req, res) => (await import("../src/api/jobs/photo_get.js")).default(req, res));
app.post("/api/jobs/:id/photo", async (req, res) => (await import("../src/api/jobs/photo_set.js")).default(req, res));
app.get("/api/jobs/:id/result", async (req, res) => (await import("../src/api/jobs/result_get.js")).default(req, res));
app.post("/api/jobs/:id/result", async (req, res) => (await import("../src/api/jobs/result_set.js")).default(req, res));
app.get("/api/jobs/:id", async (req, res) => (await import("../src/api/jobs/view.js")).default(req, res));

// Uploads
app.post("/api/uploads/presign", async (req, res) => (await import("../src/api/uploads/presign.js")).default(req, res));
// Direct upload expects raw binary body; use route-level raw parser only here
app.post("/api/uploads/direct", express.raw({ type: "*/*", limit: "25mb" }), async (req, res) => (await import("../src/api/uploads/direct.js")).default(req, res));

// Checkout Session
app.post("/api/checkout/create_checkout_session", async (req, res) => (await import("../src/api/checkout/create_checkout_session.js")).default(req, res));

// Stripe webhook requires raw body for signature verification
// If you have a webhook handler under src/api/stripe/webhook.js, import and mount it like below:
// import stripeWebhook from "../src/api/stripe/webhook.js";
// app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Export as a request handler for Vercel Serverless Functions
export default (req, res) => app(req, res);