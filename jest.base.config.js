/** Shared by the unit and integration suites. */
export default {
  rootDir: ".",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true, tsconfig: "tsconfig.test.json" }],
  },
  moduleNameMapper: {
    // Every suite gets the capturing fake, so no test can reach a real SMTP server.
    "^nodemailer$": "<rootDir>/tests/support/nodemailer.ts",
    "^@/(.*)\\.js$": "<rootDir>/src/$1",
    // NodeNext imports carry a .js extension that points at the .ts source.
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
