import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";



const app = express();


const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];


const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(" CORS blocked for origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/leetcode", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body required" });
    }

    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: "https://leetcode.com",
        origin: "https://leetcode.com",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("LeetCode fetch FAILED:", response.status, text);
      return res.status(502).json({
        error: "LeetCode upstream failed",
        status: response.status,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("LeetCode Proxy Error:", err);
    return res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});


app.get("/codeforces", async (req, res) => {
  try {
    const user = req.query.user;
    if (!user) return res.status(400).json({ error: "Missing ?user=" });

    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(
        user
      )}`
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("CF User Error:", err);
    return res.status(500).json({ error: "Failed to fetch Codeforces user" });
  }
});


app.get("/codeforces/contests", async (req, res) => {
  try {
    const user = req.query.user;
    if (!user) return res.status(400).json({ error: "Missing ?user=" });

    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(
        user
      )}`
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("CF Contest Error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch Codeforces contest history" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
