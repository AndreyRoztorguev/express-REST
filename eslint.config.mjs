import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest }, // ...globals.browser,
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
