import { afterEach, describe, expect, test } from "bun:test";
import { log } from "./log";

describe("log", () => {
  const originals = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  afterEach(() => {
    console.log = originals.log;
    console.warn = originals.warn;
    console.error = originals.error;
  });

  test("writes a single JSON line to console.log for info", () => {
    let line = "";
    console.log = (msg: unknown) => {
      line = String(msg);
    };

    log("test.event", { requestId: "r1", ip: "127.0.0.1", n: 2 }, "info");

    const obj = JSON.parse(line) as Record<string, unknown>;
    expect(obj.event).toBe("test.event");
    expect(obj.level).toBe("info");
    expect(obj.requestId).toBe("r1");
    expect(obj.ip).toBe("127.0.0.1");
    expect(obj.n).toBe(2);
    expect(typeof obj.ts).toBe("string");
    expect(line.split("\n").length).toBe(1);
  });

  test("routes warn to console.warn and error to console.error", () => {
    let warnLine = "";
    let errLine = "";
    console.warn = (msg: unknown) => {
      warnLine = String(msg);
    };
    console.error = (msg: unknown) => {
      errLine = String(msg);
    };

    log("w", { requestId: "r", ip: "x" }, "warn");
    log("e", { requestId: "r", ip: "x" }, "error");

    expect(JSON.parse(warnLine).level).toBe("warn");
    expect(JSON.parse(errLine).level).toBe("error");
  });
});
