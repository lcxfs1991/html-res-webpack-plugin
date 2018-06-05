module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    rules: {
        "indent": 0,
        "no-extra-boolean-cast": 0,
        "no-console": 0,
        "no-redeclare": 1,
        "one-var-declaration-per-line": [2, "always"],
        "no-mixed-spaces-and-tabs": 0,
        "semi": 2,
        "no-useless-escape": 0,
    },
    "globals": {
        "describe": true,
        "it": true
    }
};