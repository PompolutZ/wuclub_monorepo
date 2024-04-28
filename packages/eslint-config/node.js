// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  extends: ["plugin:security/recommended-legacy", "./base"],
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
};
