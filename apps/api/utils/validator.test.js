import { validateDeckId } from "./validator.js";

test("should not match deck id shorter than it should be using regex", () => {
  expect(validateDeckId("foo-bar")).toBeNull();
});

test("should not match deck id when nosql injection string", () => {
  expect(validateDeckId("{ $: 1}")).toBeNull();
});

describe("should not match deck id when prefix", () => {
  test("is too short", () => {
    expect(validateDeckId("a-abcdefghijkl")).toBeNull();
  });
  test("is too long", () => {
    expect(validateDeckId("abcdefg-abcdefghijkl")).toBeNull();
  });
});

describe("should not match deck id when postfix", () => {
  test("is too short", () => {
    expect(validateDeckId("ab-abcdefghijk")).toBeNull();
  });
  test("is too long", () => {
    expect(validateDeckId("abcdef-abcdefghijkl1")).toBeNull();
  });
});

describe("should match correct deck ids", () => {
  test("toftbq-01ca97e68161", () => {
    expect(validateDeckId("toftbq-01ca97e68161")).toBe("toftbq-01ca97e68161");
  });
  test("tg-fcfd1a1f3461", () => {
    expect(validateDeckId("tg-fcfd1a1f3461")).toBe("tg-fcfd1a1f3461");
  });
  test("kar-03383784ecc1", () => {
    expect(validateDeckId("kar-03383784ecc1")).toBe("kar-03383784ecc1");
  });
});
