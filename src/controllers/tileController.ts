import {Request, Response} from "express";

export class TileController {
    static getTile = (_req: Request, res: Response) => {
        // get z, x and y, and dataset, and level from request
        // find correct database - these should be opened readonly on server load
        // get data from db
        // return data
    }
}