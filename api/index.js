import express from "express";
import cors from "cors";

// API route handlers (reuse existing implementation under src/api/*)
import contactSend from "../src/api/contact/send.js";
import magicStart from "../src/api/auth/magic/start.js";
import signup from "../src/api/auth/signup.js";
import verifyEmail from "../src/api/auth/verify-email.js";
import checkoutSession from "../src/api/checkout/create_checkout_session.js";
import adminLogin from "../src/api/auth/admin/login.js";
import stylesList from "../src/api/styles/list.js";
import stylesPreview from "../src/api/styles/preview.js";
import usersList from "../src/api/admin/users/list.js";

// If you have more routes in src/api/* add them here similarly

const app = express();

// JSON and raw bodies for uploads or webhook-like handlers
app.use(express.json({ limit: "25mb" }));
app.use(express.raw({ type: "*/*", limit: "25mb" }));

// Same-origin on Vercel, so CORS is permissive or unnecessary; keep simple
app.use(cors());

// Health check
app.get("/api/ping", (req, res) => res.json({ ok: true, pong: true }));

// Contact
app.post("/api/contact/send", contactSend);

// Auth
app.post("/api/auth/magic/start", magicStart);
app.post("/api/auth/signup", signup);
app.get("/api/auth/verify-email", verifyEmail);
app.post("/api/auth/admin/login", adminLogin);

// Styles
app.get("/api/styles/list", stylesList);
app.get("/api/styles/preview", stylesPreview);

// Admin
app.get("/api/admin/users/list", usersList);

// Export as a request handler for Vercel Serverless Functions
export default (req, res) => app(req, res);