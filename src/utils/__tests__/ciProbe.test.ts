import { expect, test } from "@jest/globals";

test("ci probe fails on purpose", () => {
  expect(1).toBe(2);
});
