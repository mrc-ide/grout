import request, { Response } from "supertest";
import Ajv from "ajv/dist/2020"
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

const getSchema = async (schemaName) => {
    return await import (`../../schema/${schemaName}.schema.json`);
};

export const validateResponse = async (response: Response, dataSchemaName: string | undefined) => {
    const ajv = new Ajv();
    const responseSchema = await getSchema("Response"); // outer Response schema

    // if a data schema name isn't provided, assume we want null data - provide a minimal schema to keep the $ref happy
    const dataSchema = dataSchemaName ? await getSchema(dataSchemaName) : { type: "null" };

    // Append grout-data $id to the required data schema so that the $ref in response schema targeting that $id is found.
    dataSchema.$id = "grout-data";
    ajv.addSchema(dataSchema);

    const validate = ajv.compile(responseSchema);
    expect(validate(response.body), `Schema errors: \n ${ajv.errorsText(validate.errors)} \nfor response: \n${JSON.stringify(response.body, null, 2)}`).toBe(true);
};

// Get data from server, expect successful result, validate against schema, and return body.data
export const getData = async (url: string, dataSchemaName: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(200);

    await validateResponse(response, dataSchemaName);

    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return response.body.data;
};
