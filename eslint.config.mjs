import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node,
      ...globals.jquery,
      ...globals.jest,
    },
  }}, //グローバル変数
  eslintConfigPrettier, //prettierとの併用
  pluginJs.configs.recommended, //推奨設定
  pluginReactConfig, //Reactの推奨設定
  {
    files: ["**/*.{jsx,js}"],
    rules: {
      "react/react-in-jsx-scope": "off", //Reactのimport
      "no-unused-vars": "off", //未使用の変数
      "react/prop-types": "off", //コンポーネント定義不足
    },
  },
];