import express from "express";
import { getAll, getById, create, updateById, deleteById } from "./store.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/api/v1/whisper", async (req, res) => {
  const whispers = await getAll();
  res.json(whispers);
});

app.get("/api/v1/whisper/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const whisper = await getById(id);
  if (!whisper) {
    res.sendStatus(404);
  } else {
    res.json(whisper);
  }
});

app.post("/api/v1/whisper", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.sendStatus(400);
  } else {
    const whisper = await create(message);
    res.status(201).json(whisper);
  }
});

app.put("/api/v1/whisper/:id", async (req, res) => {
  const { message } = req.body;
  const id = parseInt(req.params.id);
  if (!message) {
    res.sendStatus(400);
  } else {
    const whisper = await getById(id);
    if (!whisper) {
      res.sendStatus(404);
    } else {
      await updateById(id, message);
      res.sendStatus(200);
    }
  }
});

app.delete("/api/v1/whisper/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const whisper = await getById(id);
  if (!whisper) {
    res.sendStatus(404);
    return;
  }
  await deleteById(id);
  res.sendStatus(200);
});

app.get("/about", async (req, res) => {
  const whispers = await getAll();
  res.render("about", { whispers });
});

export { app };
