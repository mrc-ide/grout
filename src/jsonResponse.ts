import { Response } from "express";

//TODO: use json response on success for index response (and metadata). Can't use it for tile data!
const addContentType = (res: Response) => {
    res.header("Content-Type", "application/json");
};

export const jsonResponseError = (
    httpStatus: number,
    error: string,
    detail: string,
    res: Response
) => {
    addContentType(res);
    const responseObject = {
        status: "failure",
        errors: [
            { error, detail }
        ],
        data: null
    };
    res.status(httpStatus);
    res.end(JSON.stringify(responseObject));
};