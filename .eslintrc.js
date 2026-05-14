module.exports = {
	"env": {
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{ "MemberExpression": 0, "flatTernaryExpressions": true }
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-unused-vars": [
			"error",
			{ "argsIgnorePattern": "^_"}
		],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ "argsIgnorePattern": "^_"}
		],
		"no-multi-spaces": ["error"],
		"comma-dangle": ["error", "always-multiline"],
		"no-mixed-spaces-and-tabs": ["error"],
		"prefer-template": ["error"],
		"template-curly-spacing": ["error", "never"],
		"func-style": ["error", "expression"],
	}
};
