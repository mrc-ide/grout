import { Router } from "express";
import { IndexController } from "./controllers/indexController";
import { TileController } from "./controllers/tileController";
import notFound from "./errors/notFound";
import { MetadataController } from "./controllers/metadataController";

export const registerRoutes = (rootDir: string) => {
    const router = Router();
    router.get("/", IndexController.getIndex);
    router.get("/metadata", MetadataController.getMetadata);
    router.get("/tile/:dataset/:level/:z/:x/:y", TileController.getTile);
    router.get("/test", (_, res) => {
        res.sendFile(`${rootDir}/pages/test.html`);
    });

    // provide an endpoint we can use to test 500 response behaviour by throwing an "unexpected error" - but only if we
    // are running in a non-production mode indicated by an env var
    if (process.env.GROUT_ERROR_TEST) {
        router.get("/error-test", () => {
            throw Error("Testing error behaviour");
        });
    }

    // Throw 404 error for any unmatched routes
    router.use(notFound);

    return router;
};
