const path = require('path');

module.exports = {
    //devtool: 'eval-source-map',
    entry: './src/index.tsx',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'bundle')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.tsx)/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    }
};