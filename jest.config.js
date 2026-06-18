/** @type {import("jest").Config} */
module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/mocks/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/services/sessionBootstrap.ts",
    "src/services/socketManager.ts",
    "src/services/stockfishService.ts",
    "src/services/apiManager.ts",
    "src/hooks/useSessionBootstrap.ts",
    "src/components/historyList/historyListReducers.ts",
    "src/components/openingExplorer/openingExplorerReducers.ts",
    "src/components/syzygyExplorer/syzygyExplorerReducers.ts",
    "src/components/gamesDatabaseExplorer/gamesDatabaseReducers.ts",
    "src/components/menu/pgnImportForm.tsx",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
