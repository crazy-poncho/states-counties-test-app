import express from "express";
import cors from "cors";
import helmet from "helmet";
import { statesRouter } from "./routes/states.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Honor X-Forwarded-* from Nginx/Vite so detail URLs use the browser origin.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(statesRouter);
app.use(errorHandler);
