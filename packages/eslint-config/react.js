import globals from "globals";
import base from "./base.js";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  reactJsx,
  ...base,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
];
