import base from "./jest.base.config.js";

export default {
  ...base,
  displayName: "integration",
  roots: ["<rootDir>/tests/integration"],
  globalSetup: "<rootDir>/tests/integration/setup/global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup/hooks.ts"],
};
