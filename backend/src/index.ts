import { config } from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import user from "./routers/user";
import password from "./routers/password";

config();

let app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/password", password);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/passman";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB verbunden");
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB-Verbindung fehlgeschlagen", err);
    process.exit(1);
  });
