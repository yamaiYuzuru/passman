import { Schema, model } from "mongoose";
import { User } from "../types";
let UserSchema = new Schema<User>({
  email: { type: String, unique: true },
  passwort: { type: String, required: true },
});

export default model("users", UserSchema);
