import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from "bun:test";

// Control the mocked Resend client per-test without real network calls.
type SendResult = { data: unknown; error: { message?: string } | null };
let sendResult: SendResult = { data: { id: "mock-id" }, error: null };
let sendShouldThrow = false;
let lastSendArgs: unknown = null;

mock.module("resend", () => ({
  Resend: class {
    emails = {
      send: async (args: unknown): Promise<SendResult> => {
        lastSendArgs = args;
        if (sendShouldThrow) throw new Error("network down");
        return sendResult;
      },
    };
  },
}));

const { POST } = await import("./route");

const RESEND_KEY = "RESEND_API_KEY";

function postJson(body: unknown, ip = "test-ip", headers: Record<string, string> = {}) {
  return POST(
    new Request("https://x.test/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/submit", () => {
  const consoleOriginals = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    process.env[RESEND_KEY] = "re_test_key";
    sendResult = { data: { id: "mock-id" }, error: null };
    sendShouldThrow = false;
    lastSendArgs = null;
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  });

  afterEach(() => {
    console.log = consoleOriginals.log;
    console.warn = consoleOriginals.warn;
    console.error = consoleOriginals.error;
  });

  afterAll(() => {
    delete process.env[RESEND_KEY];
  });

  test("rejects invalid JSON with 400", async () => {
    const res = await postJson("{not json", "ip-json");
    expect(res.status).toBe(400);
  });

  test("honeypot returns a fake success and never sends", async () => {
    const res = await postJson(
      { idea: "real idea", website: "i am a bot" },
      "ip-honey",
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(lastSendArgs).toBeNull();
  });

  test("missing idea returns 400", async () => {
    const res = await postJson({ idea: "   " }, "ip-noidea");
    expect(res.status).toBe(400);
    expect(lastSendArgs).toBeNull();
  });

  test("missing Resend key returns 500 (misconfigured)", async () => {
    delete process.env[RESEND_KEY];
    const res = await postJson({ idea: "a good idea" }, "ip-misconf");
    expect(res.status).toBe(500);
    expect(lastSendArgs).toBeNull();
  });

  test("valid submission sends mail and returns ok", async () => {
    const res = await postJson(
      { idea: "Build a thing", name: "Ada", email: "ada@x.test", kind: "feature" },
      "ip-ok",
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(lastSendArgs).not.toBeNull();
    const args = lastSendArgs as Record<string, unknown>;
    expect(args.replyTo).toBe("ada@x.test");
    expect(String(args.subject)).toContain("feature");
  });

  test("Resend error response surfaces a 502", async () => {
    sendResult = { data: null, error: { message: "bad request" } };
    const res = await postJson({ idea: "another idea" }, "ip-502");
    expect(res.status).toBe(502);
  });

  test("thrown Resend exception surfaces a 500", async () => {
    sendShouldThrow = true;
    const res = await postJson({ idea: "yet another idea" }, "ip-throw");
    expect(res.status).toBe(500);
  });

  test("blocks after exceeding the rate limit from one IP", async () => {
    const ip = "ip-flood";
    for (let i = 0; i < 5; i++) {
      const ok = await postJson({ idea: `idea ${i}` }, ip);
      expect(ok.status).toBe(200);
    }
    const blocked = await postJson({ idea: "one too many" }, ip);
    expect(blocked.status).toBe(429);
  });
});
