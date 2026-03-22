// backend/server.js
// ══════════════════════════════════════════════════════════════
//  Milkman — Admin Console Server
//  Runs on:  http://localhost:5000
//  Access:   ADMIN ONLY — never exposed to customers
//  Start:    node server.js
// ══════════════════════════════════════════════════════════════

"use strict";

const express = require("express");
const session = require("express-session");
const axios   = require("axios");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Django API base URL ────────────────────────────────────────
const DJANGO_API = process.env.DJANGO_API_URL || "http://127.0.0.1:8000/api";

// ── Middleware ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret:            process.env.SESSION_SECRET || "milkman-admin-9x!kZ",
    resave:            false,
    saveUninitialized: false,
    cookie:            { maxAge: 8 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" },
  })
);

// ── Block all non-localhost access in production ───────────────
app.use((req, res, next) => {
  next(); // Disabled for local development troubleshooting
});

// ── Serve the admin SPA ────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ══════════════════════════════════════════════════════════════
//  AUTH GUARD
// ══════════════════════════════════════════════════════════════
const requireAuth = (req, res, next) => {
  if (req.session?.token && req.session?.isAdmin) return next();
  res.status(401).json({ error: "Unauthorised. Please sign in." });
};

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════

/**
 * POST /admin/login
 * Verifies admin credentials against the Django API.
 */
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password are required." });

  try {
    const { data } = await axios.post(`${DJANGO_API}/customers/login/`, { email, password });

    if (!data.customer?.is_staff)
      return res.status(403).json({ error: "Access denied. Admin privileges required." });

    req.session.token   = data.token;
    req.session.isAdmin = true;
    req.session.admin   = data.customer;

    res.json({ message: "Login successful.", admin: data.customer });
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.non_field_errors?.[0] ||
      "Authentication failed.";
    res.status(err.response?.status || 500).json({ error: msg });
  }
});

/**
 * POST /admin/logout
 */
app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out." }));
});

/**
 * GET /admin/me
 */
app.get("/admin/me", requireAuth, (req, res) => {
  res.json({ admin: req.session.admin });
});

// ══════════════════════════════════════════════════════════════
//  CUSTOMER MANAGEMENT
// ══════════════════════════════════════════════════════════════

/** GET /admin/customers — list all, optional ?search= */
app.get("/admin/customers", requireAuth, async (req, res) => {
  try {
    const params = req.query.search ? { search: req.query.search } : {};
    const { data } = await axios.get(`${DJANGO_API}/admin/customers/`, {
      headers: { Authorization: `Token ${req.session.token}` },
      params,
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to fetch customers." });
  }
});

/** GET /admin/customers/:id */
app.get("/admin/customers/:id", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${DJANGO_API}/admin/customers/${req.params.id}/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Customer not found." });
  }
});

/** PATCH /admin/customers/:id — update email, password, plan, is_staff */
app.patch("/admin/customers/:id", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.patch(
      `${DJANGO_API}/admin/customers/${req.params.id}/`,
      req.body,
      { headers: { Authorization: `Token ${req.session.token}` } }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to update customer." });
  }
});

/** DELETE /admin/customers/:id */
app.delete("/admin/customers/:id", requireAuth, async (req, res) => {
  try {
    await axios.delete(`${DJANGO_API}/admin/customers/${req.params.id}/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json({ message: "Customer deleted." });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to delete customer." });
  }
});

/** POST /admin/customers/:id/grant-admin */
app.post("/admin/customers/:id/grant-admin", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.post(
      `${DJANGO_API}/admin/customers/${req.params.id}/grant_admin/`,
      {},
      { headers: { Authorization: `Token ${req.session.token}` } }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to grant admin." });
  }
});

// ══════════════════════════════════════════════════════════════
//  SUBSCRIPTION MANAGEMENT
// ══════════════════════════════════════════════════════════════

/** GET /admin/subscriptions */
app.get("/admin/subscriptions", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${DJANGO_API}/admin/subscriptions/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to fetch subscriptions." });
  }
});

/** POST /admin/subscriptions — create manually */
app.post("/admin/subscriptions", requireAuth, async (req, res) => {
  try {
    const { customer_id, start_date } = req.body;
    const start = new Date(start_date);
    const end   = new Date(start);
    end.setDate(end.getDate() + 30);

    const { data } = await axios.post(
      `${DJANGO_API}/admin/subscriptions/`,
      {
        customer:   customer_id,
        start_date: start.toISOString().split("T")[0],
        end_date:   end.toISOString().split("T")[0],
      },
      { headers: { Authorization: `Token ${req.session.token}` } }
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to create subscription." });
  }
});

/** DELETE /admin/subscriptions/:id */
app.delete("/admin/subscriptions/:id", requireAuth, async (req, res) => {
  try {
    await axios.delete(`${DJANGO_API}/admin/subscriptions/${req.params.id}/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json({ message: "Subscription cancelled." });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to cancel subscription." });
  }
});

/** PATCH /admin/subscriptions/:id — update end_date or status */
app.patch("/admin/subscriptions/:id", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.patch(
      `${DJANGO_API}/admin/subscriptions/${req.params.id}/`,
      req.body,
      { headers: { Authorization: `Token ${req.session.token}` } }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to update subscription." });
  }
});

// ══════════════════════════════════════════════════════════════
//  PRODUCT MANAGEMENT
// ══════════════════════════════════════════════════════════════

/** GET /admin/products */
app.get("/admin/products", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${DJANGO_API}/products/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to fetch products." });
  }
});

/** POST /admin/products */
app.post("/admin/products", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.post(`${DJANGO_API}/admin/products/`, req.body, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to add product." });
  }
});

/** PATCH /admin/products/:id — update price, availability, etc */
app.patch("/admin/products/:id", requireAuth, async (req, res) => {
  try {
    const { data } = await axios.patch(
      `${DJANGO_API}/admin/products/${req.params.id}/`,
      req.body,
      { headers: { Authorization: `Token ${req.session.token}` } }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to update product." });
  }
});

/** DELETE /admin/products/:id */
app.delete("/admin/products/:id", requireAuth, async (req, res) => {
  try {
    await axios.delete(`${DJANGO_API}/admin/products/${req.params.id}/`, {
      headers: { Authorization: `Token ${req.session.token}` },
    });
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Failed to delete product." });
  }
});

// ══════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ══════════════════════════════════════════════════════════════
app.get("/health", (req, res) => {
  res.json({
    status:    "ok",
    service:   "Milkman Admin Console",
    port:      PORT,
    django:    DJANGO_API,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 catch-all ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, "127.0.0.1", () => {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   🥛  Milkman Admin Console                  ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║   URL  →  http://localhost:${PORT}               ║`);
  console.log("║   Access: ADMIN ONLY (localhost-restricted)  ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log("║   Login:  admin@milkman.in                   ║");
  console.log("║   Pass:   admin123                           ║");
  console.log("╚══════════════════════════════════════════════╝\n");
});
