import { describe, expect, test, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import { ConfigReader } from "../../src/configReader";

// tell vitest to use fs mock from __mocks__ folder
vi.mock("fs");

beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
});

describe("ConfigReader", () => {
    test("can read config file", () => {
        const folder = "/testRoot/config";
        const path = `${folder}/grout.config.json`;
        const testConfig = { port: 1234 };
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(path, JSON.stringify(testConfig), {});

        const sut = new ConfigReader("/testRoot");
        const result = sut.readConfigFile("config", "grout.config.json");
        expect(result).toStrictEqual(testConfig);
    });

    test("throws error if config file does not exist", () => {
        const sut = new ConfigReader("/testRoot");
        expect(() =>
            sut.readConfigFile("nonexistent.config.json")
        ).toThrowError("File /testRoot/nonexistent.config.json does not exist");
    });
});
