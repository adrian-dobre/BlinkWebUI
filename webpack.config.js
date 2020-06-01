/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';

const webpackConfig = {
    entry: [path.resolve(__dirname, 'src', 'index.tsx')],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
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
        new webpack.IgnorePlugin(
            /youtube|dailymotion|vimeo|facebook|twitch|soundcloud|mixcloud|wistia|vidyard/i,
            /react-player/
        ),
        new MiniCssExtractPlugin(),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    // eslint-disable-next-line no-param-reassign
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                    (fileName) => !fileName.endsWith('.map')
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles
                };
            }
        })
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

module.exports = webpackConfig;
