import config from "@fxdxpz/eslint-config/react.js";

export default [
  ...config,
  {
    rules: {
      // TODO: fix these
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "import-x/default": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/use-memo": "warn",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js", "**/tests/**/*.ts", "**/tests/**/*.tsx", "**/tests/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];
