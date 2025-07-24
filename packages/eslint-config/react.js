import globals from "globals";
import base from "./base.js";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactHooks from "eslint-plugin-react-hooks/index.js";
import { fixupPluginRules } from "@eslint/compat";

export default [
  ...base,
  reactJsx,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    plugins: {
      "react-hooks": fixupPluginRules(pluginReactHooks),
    },
  },
  {
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "error",
    }
  },
  {
    // rules to fix someday
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unreachable": "warn",
      "no-undef": "warn",
    }
  }
];
