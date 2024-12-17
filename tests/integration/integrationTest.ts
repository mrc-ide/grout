import request from "supertest";
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

// Get data from server, expect successful result and return body.data
export const getData = async (url: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return response.body.data;
};
