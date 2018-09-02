module.exports = {
    "env": {
        "browser": false,
        "commonjs": true,
		"es6": true,
		"node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        'no-console': 'off',
    }
};
