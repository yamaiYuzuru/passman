import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  passwort: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      JWT_SECRET: string;
    }
  }
}
