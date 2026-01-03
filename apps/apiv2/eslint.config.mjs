import config from "@fxdxpz/eslint-config/node.js";

export default [
  ...config,
  {
    files: ["**/*.test.ts", "**/*.test.js", "**/tests/**/*.ts", "**/tests/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];
