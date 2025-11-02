import express from "express";
import cors from "cors";

// API route handlers (reuse existing implementation under src/api/*)
import contactSend from "../src/api/contact/send.js";
import magicStart from "../src/api/auth/magic/start.js";
import signup from "../src/api/auth/signup.js";
import signin from "../src/api/auth/signin.js";
import signout from "../src/api/auth/signout.js";
import verifyEmail from "../src/api/auth/verify-email.js";
import forgotPassword from "../src/api/auth/forgot-password.js";
import resetPassword from "../src/api/auth/reset-password.js";
import authMe from "../src/api/auth/me.js";
import checkoutSession from "../src/api/checkout/create_checkout_session.js";
import adminLogin from "../src/api/auth/admin/login.js";
import adminMe from "../src/api/admin/me.js";
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
app.post("/api/auth/signin", signin);
app.post("/api/auth/signout", signout);
app.get("/api/auth/verify-email", verifyEmail);
app.get("/api/auth/me", authMe);
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/reset-password", resetPassword);
app.post("/api/auth/admin/login", adminLogin);
app.get("/api/admin/me", adminMe);

// Styles
app.get("/api/styles", stylesList);
app.get("/api/styles/:id/preview", stylesPreview);

// Admin
app.get("/api/admin/users", usersList);

// Export as a request handler for Vercel Serverless Functions
export default (req, res) => app(req, res);