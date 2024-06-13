/* eslint-disable import/no-anonymous-default-export */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import eslintConfigStandard from "eslint-config-standard";

export default [
  {languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node,
      ...globals.jquery,
    },
  }},
  pluginJs.configs.recommended, //推奨設定
  pluginReactConfig, //Reactの推奨設定（おそらく）
  {
    files: ["**/*.{jsx,js}"],
    rules: {
      "react/react-in-jsx-scope": "off", //Reactnのimport
      "no-unused-vars": "off", //未使用の変数
      "react/prop-types": "off", //コンポーネント定義不足
    },
  },
  eslintConfigStandard,
];