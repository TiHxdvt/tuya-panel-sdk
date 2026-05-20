/**
 * This file was auto-generated from your default configuration.
 * Babel configuration now uses CommonJS module format.
 */
const path = require('path');

module.exports = {
"presets": [
"module:metro-react-native-babel-preset",
"@babel/preset-typescript"
],
"plugins": [
["@babel/plugin-proposal-decorators", {"legacy":true}],
["module-resolver", {
  "root": [
    "./"
  ],
  "extensions": [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json"
  ]
}]
]
};
