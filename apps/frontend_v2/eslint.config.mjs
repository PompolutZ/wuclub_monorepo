import config from "@fxdxpz/eslint-config/react.js";

export default [
  ...config,
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js", "**/tests/**/*.ts", "**/tests/**/*.tsx", "**/tests/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];
