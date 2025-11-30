// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// Allow requests from your Netlify site (adjust origin if you want stricter)
app.use(
  cors({
    origin: "https://cheery-kheer-cfa7fb.netlify.app", // or "https://your-netlify-site.netlify.app"
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
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("LeetCode fetch failed", response.status, text);
      return res
        .status(502)
        .json({ error: "Upstream fetch failed", status: response.status });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to fetch LeetCode data" });
  }
});

// IMPORTANT: use process.env.PORT for Render/Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
