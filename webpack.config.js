const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './client/src/main.js',
    output: {
        path: path.resolve(__dirname, 'client/dest'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            // { test: /\.css$/, use: 'css-loader' },
            // { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.js$/,
                // exclude: /(node_modules\/|bower_components|server)/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'env']
                    }
                }
            }
        ]
    },
    plugins: [
        // new webpack.SourceMapDevToolPlugin({})
    ]
};