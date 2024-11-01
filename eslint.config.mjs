import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: { ...globals.node, MY_CUSTOM_GLOBAL: "readonly" }, // ...globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    rules: Object.fromEntries(
      Object.entries(pluginJs.configs.recommended.rules).map(([rule]) => [
        rule,
        "warn",
      ])
    ),
  },
];
