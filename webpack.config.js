// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: [path.resolve(__dirname, 'src', 'index.tsx')],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // devtool: devMode ? 'source-map' : '',
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader']
            },
            {
                test: /\.html/,
                use: ['html-loader']
            },
            {
                test: /\.module\.s([ac])ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCase',
                            modules: {
                                localIdentName: '[local]--[hash:base64:10]'
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.s([ac])ss$/,
                exclude: /\.module\.s([ac])ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html')
        }),
        new StylelintPlugin({
            allowEmptyInput: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new MiniCssExtractPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        host: 'ui.blinkforhome.com',
        overlay: true,
        port: 8888
    }
};
