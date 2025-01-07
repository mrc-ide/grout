import request from "supertest";
import Ajv from "ajv/dist/2020"
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

const getSchema = async (schemaName) => {
    return await import (`../../schema/${schemaName}.schema.json`);
};

// Get data from server, expect successful result, validate against schema, and return body.data
export const getData = async (url: string, dataSchemaName: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(200);

    const ajv = new Ajv();

    const responseSchema = await getSchema("Response"); // outer Response schema
    const dataSchema = await getSchema(dataSchemaName);
    // Append grout-data $id to the required data schema so that the $ref in response schema targeting that $id is found.
    dataSchema.$id = "grout-data";
    ajv.addSchema(dataSchema);

    const validate = ajv.compile(responseSchema);
    expect(validate(response.body), `Response schema errors: \n ${ajv.errorsText(validate.errors)} \nfor response: \n${JSON.stringify(response.body, null, 2)}`).toBe(true);

    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return response.body.data;
};
