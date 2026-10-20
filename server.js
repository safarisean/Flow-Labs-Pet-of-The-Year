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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Pet tournament running on port ${PORT}`);
});
