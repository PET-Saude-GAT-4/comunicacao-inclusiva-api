import base from "./jest.base.config.js";

export default {
  ...base,
  displayName: "unit",
  // Unit tests live beside the code they cover; tests/unit holds only their support.
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/unit/env.ts"],
};
