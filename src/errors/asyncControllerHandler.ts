import { NextFunction } from "express";

// This method should be used to wrap any async controller methods to ensure error handling is applied
export default async (next: NextFunction, method: () => void) => {
    try {
        await method();
    } catch (error) {
        next(error);
    }
};
