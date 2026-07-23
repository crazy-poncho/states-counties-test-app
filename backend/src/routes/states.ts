import { Router } from "express";
import { getStateDetail, listStates } from "../controllers/statesController.js";

const statesRouter = Router();

statesRouter.get("/states", listStates);
statesRouter.get("/state/:name", getStateDetail);

export default statesRouter;