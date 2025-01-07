import request from "supertest";
import Ajv from "ajv/dist/2020"
import { expect } from "vitest";

export const grout = request("http://localhost:5000");

const getSchema = async (schemaName) => {
    return await import (`../../schema/${schemaName}.schema.json`);
};

const buildFullSchema = (responseSchema: object, dataSchema: object) => {
    // TODO: use ajv Schema type
    // Combine the generic response schema with the expected inner data schema to get single
    // full schema we can use to validate a response.
    // This wouldn't be needed if we could ust $dynamicRef, but ajv implementation is incomplete:
    // https://github.com/ajv-validator/ajv/issues/1573

    // Expect responseSchema to define "oneOf" for "data" and replace any generic object type
    // with expected data schema
    if (!responseSchema.properties?.data?.oneOf) {
        throw("Expected response schema to have properties.data.oneOf path");
    }

    // filter out generic object type from data property, and replace with data schema
    const newOneOf = [...responseSchema.properties.data.oneOf]
        .filter((schema) => schema != {type: "object"});
    newOneOf.push(dataSchema);
    responseSchema.properties.data.oneOf = newOneOf;
}

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
