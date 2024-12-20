import request from "supertest";
import Ajv from "ajv/dist/2020"
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

// Get data from server, expect successful result, validate against schema, and return body.data
export const getData = async (url: string, schemaName: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(200);

    const schema = await import (`../../schema/${schemaName}.schema.json`);
    const validateSchema = new Ajv().compile(schema);
    validateSchema(response.body);

    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return response.body.data;
};
