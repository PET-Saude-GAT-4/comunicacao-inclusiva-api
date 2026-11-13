import base from "./jest.base.config.js";

export default {
  ...base,
  displayName: "unit",
  roots: ["<rootDir>/tests/unit"],
  setupFiles: ["<rootDir>/tests/support/unit-env.ts"],
};
