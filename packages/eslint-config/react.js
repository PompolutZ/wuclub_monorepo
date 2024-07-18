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
];
