module.exports = {
	"env": {
		"node": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module",
		"parser": "@typescript-eslint/parser"
	},
	"rules": {
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"indent": ["error", "tab"],
		"no-multi-spaces": ["error"]
	},
	"plugins": [
		"@typescript-eslint"
	]
};
