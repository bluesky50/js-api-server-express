module.exports = {
    "env": {
		"browser": false,
		"node": true,
		"jest": true,
        "es6": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
	},
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
		],
		"comma-dangle": [
			"error", 
			"never"
		],
		"no-unused-vars": [
            "error",
            {
                "vars": "local",
                "args": "none"
            }
        ],
    }
};