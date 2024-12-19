import { Router } from "express";
import { IndexController } from "./controllers/indexController";
import { TileController } from "./controllers/tileController";

export const registerRoutes = () => {
    const router = Router();
    router.get("/", IndexController.getIndex);
    router.get("/tile/:dataset/:level/:z/:x/:y", TileController.getTile);
    return router;
};
