import request from "supertest";
import Ajv from "ajv/dist/2020"
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

    const responseSchema = await getSchema("Response"); // outer Response schema
    //ajv.addSchema(responseSchema);

    const dataSchema = await getSchema(schemaName);
    //ajv.addSchema(dataSchema);

    // First validate that the entire response conforms to the Response schema...
    const responseValidate = ajv.compile(responseSchema);
    expect(responseValidate(response.body), `Response schema errors: \n ${ajv.errorsText(responseValidate.errors)} \nfor response: \n${JSON.stringify(response.body, null, 2)}`).toBe(true);

    // ...then that the data part matches the expected data schema
    const dataValidate = ajv.compile(dataSchema);
    const data = response.body.data;
    expect(dataValidate(data), `Data schema errors: \n${ajv.errorsText(dataValidate.errors)} \nfor data: \n${JSON.stringify(data, null, 2)}`).toBe(true)

    expect(response.body.status).toBe("success");
    expect(response.body.errors).toBe(null);
    return data;
};
