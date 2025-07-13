import { Schema, model } from "mongoose";

let PasswortSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serviceName: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  iv: { type: String, required: true }, // Initialisierungsvektor für AES
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default model("passwords", PasswortSchema);
