import base from "./jest.base.config.js";

export default {
  ...base,
  displayName: "integration",
  roots: ["<rootDir>/tests/integration"],
  globalSetup: "<rootDir>/tests/support/global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/support/integration-hooks.ts"],
};
