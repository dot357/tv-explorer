// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import a11y from "eslint-plugin-vuejs-accessibility";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist", "node_modules"] },

  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: { globals: globals.browser },
    extends: [js.configs.recommended],
    rules: {
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"]
    }
  },

  // Vue + a11y
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    ...a11y.configs["flat/recommended"]
  },

  // TypeScript
  ...tseslint.configs.recommended,

  // TS parser inside SFCs
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, extraFileExtensions: [".vue"] }
    },
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
]);
