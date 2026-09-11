import { describe, expect, it } from "vitest";
import { isIgnoredExternalError } from "./ignoredExternalErrors";

const createErrorEvent = (message: string, stack?: string) =>
  new ErrorEvent("error", {
    message,
    error: Object.assign(new Error(message), { stack }),
  });

describe("isIgnoredExternalError", () => {
  it("ignores the known web-vitals reportAllChanges startTime error", () => {
    const event = createErrorEvent(
      "Uncaught TypeError: Cannot read properties of undefined (reading 'startTime')",
      "TypeError: Cannot read properties of undefined (reading 'startTime')\n    at et.reportAllChanges (<anonymous>:2:19429)",
    );

    expect(isIgnoredExternalError(event)).toBe(true);
  });

  it("keeps unrelated startTime errors visible", () => {
    const event = createErrorEvent(
      "Uncaught TypeError: Cannot read properties of undefined (reading 'startTime')",
      "TypeError: Cannot read properties of undefined (reading 'startTime')\n    at updateTask (<anonymous>:2:19429)",
    );

    expect(isIgnoredExternalError(event)).toBe(false);
  });
});
