/* eslint-disable */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactCompiler from "eslint-plugin-react-compiler";
import drizzle from "eslint-plugin-drizzle";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default tseslint.config(
  {
    ignores: [
      "src/env.js",
      ".next/**",
      "public/**",
      "next.config.js",
      "postcss.config.cjs",
      "eslint.config.mjs",
    ],
  },

  eslintPluginPrettierRecommended,

  eslint.configs.recommended,

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  nextCoreWebVitals,
  nextTypescript,

  {
    plugins: {
      drizzle,
      "react-compiler": reactCompiler,
    },

    rules: {
      "prettier/prettier": "warn",

      "react-compiler/react-compiler": "warn",

      "@typescript-eslint/array-type": ["warn"],
      "@typescript-eslint/consistent-type-imports": ["warn"],
      "@typescript-eslint/restrict-template-expressions": [
        "warn",
        {
          allowNumber: true,
        },
      ],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      ...drizzle.configs.recommended.rules,
    },
  },
);
