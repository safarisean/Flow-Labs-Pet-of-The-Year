import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    tournament: "2026 Flow Labs Pet of the Year"
  });
});

app.post("/api/vote", async (req, res) => {
  const { round, matchup, pet, voter_id } = req.body;

  if (!round || !matchup || !pet || !voter_id) {
    return res.status(400).json({ error: "Missing vote information" });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/votes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          round,
          matchup,
          pet,
          voter_id
        })
      }
    );

    if (response.status === 409) {
      return res.status(409).json({
        error: "You already voted in this matchup."
      });
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      return res.status(500).json({ error: "Vote could not be saved." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Vote could not be saved." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Pet tournament running on port ${PORT}`);
});
