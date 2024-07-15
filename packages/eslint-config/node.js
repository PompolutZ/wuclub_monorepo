import pluginSecurity from "eslint-plugin-security";
import base from "./base.js";

export default [pluginSecurity.configs.recommended, ...base];
