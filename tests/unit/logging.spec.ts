import { describe, expect, test, vi } from "vitest";
import { initialiseLogging } from "../../src/logging";

const { mockMorganResult, mockMorgan, mockToken } = vi.hoisted(() => {
    const mockMorganResult = { morgan: "mock result" };
    const mockMorgan = vi.fn().mockImplementation(() => mockMorganResult);
    const mockToken = vi.fn();
    mockMorgan.token = mockToken;
    return { mockMorganResult, mockMorgan, mockToken };
});

vi.mock("morgan", () => ({ default: mockMorgan }));

describe("initialiseLogging", () => {
    test("registers morgan custom format", () => {
        const mockApp = { use: vi.fn() } as any;
        initialiseLogging(mockApp);
        expect(mockApp.use).toHaveBeenCalledWith(mockMorganResult);
        expect(mockMorgan).toHaveBeenCalled();
        const customFormatParam = mockMorgan.mock.calls[0][0];

        const testReq = {
            remoteAddr: "remoteReq",
            remoteUser: "remoteUReq",
            method: "methodReq",
            url: "urlReq",
            status: "statusReq",
            res: "resReq",
            time: "timeReq",
            errorType: "errTypeReq",
            errorDetail: "errDetailReq",
            errorStack: "errStackReq"
        };
        const testRes = {
            remoteAddr: "remoteRes",
            remoteUser: "remoteURes",
            method: "methodRes",
            url: "urlRes",
            status: "statusRes",
            res: "resRes",
            time: "timeRes"
        };

        const tokens = {
            "remote-addr": (req: any, res: any) =>
                `${req.remoteAddr}:${res.remoteAddr}`,
            "remote-user": (req: any, res: any) =>
                `${req.remoteUser}:${res.remoteUser}`,
            method: (req: any, res: any) => `${req.method}:${res.method}`,
            url: (req: any, res: any) => `${req.url}:${res.url}`,
            status: (req: any, res: any) => `${req.status}:${res.status}`,
            res: (req: any, res: any, name: string) =>
                `${req.res}:${res.res}:${name}`,
            "response-time": (req: any, res: any) => `${req.time}:${res.time}`,
            "error-type": (req: any, res: any) => req.errorType,
            "error-detail": (req: any, res: any) => req.errorDetail,
            "error-stack": (req: any, res: any) => req.errorStack
        };

        const expectedLog =
            "remoteReq:remoteRes remoteUReq:remoteURes methodReq:methodRes urlReq:urlRes " +
            "statusReq:statusRes resReq:resRes:content-length - timeReq:timeRes ms errTypeReq errDetailReq errStackReq";
        expect(customFormatParam(tokens, testReq, testRes)).toBe(expectedLog);
    });
});
