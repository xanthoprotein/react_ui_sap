module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
    "\\.(png|jpg|jpeg|gif|svg)$": "jest-transform-stub",
  },
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "jest-transform-stub",
    "\\.(css|scss)$": "identity-obj-proxy",
    "^axios$": require.resolve("axios"),
  },
  transformIgnorePatterns: ["node_modules/(?!(lucide-react|axios)/).+"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  reporters: ["default", ["jest-html-reporter", { pageTitle: "Test Report" }]],
};
