import { Router } from "express";
import { IndexController } from "./controllers/indexController";
import { TileController } from "./controllers/tileController";
import notFound from "./errors/notFound";

export const registerRoutes = () => {
    const router = Router();
    router.get("/", IndexController.getIndex);
    router.get("/tile/:dataset/:level/:z/:x/:y", TileController.getTile);

    // Throw 404 error for any unmatched routes
    router.use(notFound);

    return router;
};
