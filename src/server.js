import express from "express";
import authRouter from "./routes/auth/index.js";
import whispersRouter from "./routes/whisper/index.js";
import * as whisper from "./stores/whisper.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(authRouter);
app.use(whispersRouter);

app.get("/about", async (req, res) => {
  const whispers = await whisper.getAll();
  res.render("about", { whispers });
});

export { app };
