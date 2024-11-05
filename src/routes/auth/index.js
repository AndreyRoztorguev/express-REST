import { Router } from "express";
import { generateToken } from "../../utils.js";
import * as user from "../../stores/user.js";

const authRouter = Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.get("/signup", (req, res) => {
  res.render("signup");
});

authRouter.get("/logout", (req, res) => {
  res.redirect("/login");
});

authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.getUserByCredentials(username, password);
    const accessToken = generateToken({ username, id: foundUser._id });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = await user.create(username, password, email);
    const accessToken = generateToken({ username, id: newUser._id });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default authRouter;
