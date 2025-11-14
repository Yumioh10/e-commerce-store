module.exports = {
      env: {
          node: true,
          es2016: true
      },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
          ecmaVersion: "es2016",
          sourceType: "module"
      },
      plugins: ["@typescript-eslint"],
}