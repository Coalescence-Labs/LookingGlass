import { describe, expect, test } from "bun:test";
import { escapeHtml, stripHeaderControls } from "./emailSafety";

describe("escapeHtml", () => {
  test("neutralizes script tags in message bodies", () => {
    const malicious = '<script>alert(1)</script>Hello';
    expect(escapeHtml(malicious)).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;Hello",
    );
  });

  test("escapes quotes and ampersands", () => {
    expect(escapeHtml(`a & b "c" 'd'`)).toBe(
      "a &amp; b &quot;c&quot; &#39;d&#39;",
    );
  });
});

describe("stripHeaderControls", () => {
  test("removes CRLF used for SMTP header injection", () => {
    const injected = "topic\r\nBcc: evil@x.test";
    expect(stripHeaderControls(injected)).toBe("topicBcc: evil@x.test");
  });
});
