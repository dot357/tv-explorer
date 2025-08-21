// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  // Ignore build artifacts
  {
    ignores: [
      "dist",
      "node_modules",
      ".storybook-static",
      "storybook-static",
    ],
  },

  // Base JS config
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    extends: [js.configs.recommended],
    rules: {
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
    },
  },

  // Vue flat preset
  ...vue.configs["flat/recommended"],

  // TypeScript flat preset
  ...tseslint.configs.recommended,

  // Single, final block for *.vue specifics (parser + TS in <script lang="ts"> + macros)
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
      globals: {
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Test files env
  {
    files: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // works fine with Vitest-style globals
      },
    },
  },
]);
