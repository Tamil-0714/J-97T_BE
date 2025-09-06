import express, { type Application, type Express } from "express";
import { API_PATHS } from "@/common/utils/api.paths";

import cors from "cors";

import { webHistoryRouter } from "@/api/webHistory/webHistory.routes";

export const createServer = (): Application => {
  const app: Express = express();
  app.set("trust proxy", true);

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: "*", credentials: true }));
  
  // Mount routers
  app.use(API_PATHS.BASE, webHistoryRouter)

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
};
