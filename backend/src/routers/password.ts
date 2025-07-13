import { Router } from "express";
import PasswordSchema from "../models/PasswordSchema";
import { AuthRequest, authMiddleware } from "../middleware/auth";

let router = Router();
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  let userId = req.userId!;

  let passwords = await PasswordSchema.find({ userId });
  res.status(200).json(passwords);
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  let userId = req.userId;
  let { serviceName, username, encryptedPassword, iv, url } = req.body;
  if (!serviceName || !username || !encryptedPassword || !iv) {
    return res
      .status(400)
      .json({ status: 400, message: "parameters are missing" });
  }

  let newEntry = new PasswordSchema({
    userId,
    username,
    encryptedPassword,
    iv,
    url,
  });

  await newEntry.save();
  res.status(210).json(newEntry);
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = req.params.id;
  const { serviceName, username, encryptedPassword, iv, url } = req.body;

  let entry = await PasswordSchema.findOne({ _id: id, userId });
  if (!entry)
    return res.status(404).json({ status: 404, message: "Entry not found." });
  if (serviceName) entry.serviceName = serviceName;
  if (username) entry.username = username;
  if (encryptedPassword) entry.encryptedPassword = encryptedPassword;
  if (iv) entry.iv = iv;
  if (url) entry.url = url;
  await entry.save();
  res.status(200).json(entry);
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = req.params.id;

  const deleted = await PasswordSchema.findOneAndDelete({ _id: id, userId });
  if (!deleted) {
    return res.status(404).send("Eintrag nicht gefunden");
  }

  res.status(204).send();
});

export default router;
