import { Router } from "express";
import { generateToken, requireAuthentication } from "../../utils.js";
import * as user from "../../stores/user.js";
import * as whisper from "../../stores/whisper.js";

const whispersRouter = Router();

whispersRouter.get("/api/v1/whisper", async (req, res) => {
  const whispers = await whisper.getAll();
  res.json(whispers);
});

whispersRouter.get("/api/v1/whisper/:id", async (req, res) => {
  const id = req.params.id;
  const storedWhisper = await whisper.getById(id);
  if (!storedWhisper) {
    res.sendStatus(404);
  } else {
    res.json(storedWhisper);
  }
});

whispersRouter.post("/api/v1/whisper", requireAuthentication, async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.sendStatus(400);
    return;
  } else {
    const newWhisper = await whisper.create(message, req.user.id);
    res.status(201).json(newWhisper);
  }
});

whispersRouter.put("/api/v1/whisper/:id", requireAuthentication, async (req, res) => {
  const { message } = req.body;
  const id = req.params.id;
  if (!message) {
    res.sendStatus(400);
    return;
  }
  const storedWhisper = await whisper.getById(id);
  if (!storedWhisper) {
    res.sendStatus(404);
    return;
  }

  if (storedWhisper.author.id !== req.user.id) {
    res.sendStatus(403);
    return;
  }
  await whisper.updateById(id, message);
  res.sendStatus(200);
});

whispersRouter.delete("/api/v1/whisper/:id", requireAuthentication, async (req, res) => {
  const id = req.params.id;
  const storedWhisper = await whisper.getById(id);
  if (!storedWhisper) {
    res.sendStatus(404);
    return;
  }

  if (storedWhisper.author.id !== req?.user?.id) {
    res.sendStatus(403);
    return;
  }
  await whisper.deleteById(id);
  res.sendStatus(200);
});

export default whispersRouter;
