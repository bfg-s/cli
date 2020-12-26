const path = require('path');
const webpack = require('webpack');

let env = process.env.NODE_ENV
let isDev = env === 'development'

const WEBPACK_CONFIG = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'bundle'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /(\.ts)/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    }
};

if (!isDev) {
    WEBPACK_CONFIG.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ];
} else {
    //WEBPACK_CONFIG.devtool = 'eval-source-map';
}

module.exports = WEBPACK_CONFIG;