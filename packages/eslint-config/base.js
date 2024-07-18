// module.exports = {
//   extends: [
//     "eslint:recommended",
//     "plugin:import/recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:prettier/recommended",
//   ],
//   parser: "@typescript-eslint/parser",
//   plugins: ["@typescript-eslint", "import"],
//   rules: {
//     "no-console": ["error", { allow: ["warn", "error", "info"] }],
//   },
// };
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
  },
);
