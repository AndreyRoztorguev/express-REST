import express from "express";

const app = express();

app.get("/api/v1/whisper", (req, res) => {
  res.json([]);
});

app.get("/api/v1/whisper/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json({ id });
});

app.post("/api/v1/whisper", (req, res) => {
  res.status(201).json(req.body);
});

app.put("/api/v1/whisper/:id", (req, res) => {
  res.sendStatus(200);
});

app.delete("/api/v1/whisper/:id", (req, res) => {
  res.sendStatus(200);
});

export { app };
