import request from "supertest";
import Ajv from "ajv/dist/2020"
import { registerSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

const getSchema = async (schemaName) => {
    return await import (`../../schema/${schemaName}.schema.json`);
};

// Get data from server, expect successful result, validate against schema, and return body.data
export const getData = async (url: string, schemaName: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(200);

    const ajv = new Ajv();

    const schema = await getSchema(schemaName);
    ajv.addSchema(schema);

    const responseSchema = await getSchema("Response"); // We always need the outer Response schema
    ajv.addSchema(responseSchema);

    registerSchema(responseSchema, "https://example.com/grout-response");
    registerSchema(schema, "https://example.com/grout-index");

    const output = await validate("https://example.com/grout-index", response.body);


    const valid = ajv.validate(schema, response.body);
    //const validate = ajv.compile(schema);
    //const valid = validate(response.body);
    expect(valid, `Schema errors: \n ${JSON.stringify(ajv.errors)} \nfor response: \n${JSON.stringify(response.body, null, 2)}`).toBe(true);

    expect(output.valid, `Schema errors: ${JSON.stringify(output)}`).toBe(true);

    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return response.body.data;
};
