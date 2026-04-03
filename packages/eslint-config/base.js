import eslint from "@eslint/js";
import { configs as tslintConfigs, config } from "typescript-eslint";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

const prettierConfig = {
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
};

export default config(
  eslint.configs.recommended,
  tslintConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintPluginPrettierRecommended,
  {
    // find rules here: https://eslint.org/docs/latest/rules
    rules: {
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: false },
      ],
      "prettier/prettier": ["error", prettierConfig],
    },
  },
  {
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: "./tsconfig.json",
        }),
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".yalc/**",
      "cdk.out/**",
    ],
  },
);
