const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'pgsa-apps.min.js'
    },
    mode: "production",
    devtool: 'source-map',
    module:{
        rules:[

        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
    plugins: [
    ]
}