import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

// 👇 Fix for ESM (__dirname not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Load .env BEFORE importing other modules
dotenv.config({ path: path.join(__dirname, ".env") });

// 👇 Dynamically import chatRoute after dotenv is loaded
(async () => {
  const chatRoute = (await import("./routes/chat.js")).default;

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/chat", chatRoute);

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})();