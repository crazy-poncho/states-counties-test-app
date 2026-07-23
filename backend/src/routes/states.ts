import { Router } from "express";
import { getStateDetail, listStates } from "../controllers/statesController.js";

export const statesRouter = Router();

statesRouter.get("/states", listStates);
statesRouter.get("/state/:name", getStateDetail);
