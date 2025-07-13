import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserSchema from "../models/UserSchema";

let router = Router();

let JWT_SECRET = process.env.JWT_SECRET || "uBOIndboxnp";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email und Passwort benötigt");

  const existingUser = await UserSchema.findOne({ email });
  if (existingUser) return res.status(400).send("User existiert bereits");

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new UserSchema({ email: email, passwort: passwordHash });
  await newUser.save();

  res.status(201).send("User registriert");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email und Passwort benötigt");

  const user = await UserSchema.findOne({ email });
  if (!user) return res.status(401).send("Ungültige Zugangsdaten");

  const valid = await bcrypt.compare(password, user.passwort);
  if (!valid) return res.status(401).send("Ungültige Zugangsdaten");

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ token });
});

export default router;
