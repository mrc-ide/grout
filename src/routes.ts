import { Router } from "express";
import { IndexController } from "./controllers/indexController";

export const registerRoutes = () => {
    const router = Router();
    router.get("/", IndexController.getIndex);
    return router;
};
