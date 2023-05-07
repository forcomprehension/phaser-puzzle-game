const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const tsConfig = require('./tsconfig.json');

const rootPath = path.resolve(__dirname);
const outputPath = path.resolve(rootPath, 'dist');
const publicPath = path.resolve(rootPath, 'public');

function buildAliases(defaultAliases = {}) {
    return Object.entries(tsConfig.compilerOptions.paths).reduce((acc, [aliasKey, aliasValue]) => {
        const pathForCurrentAlias = aliasValue[0].replace('/*', '');
        const currentKey = aliasKey.replace('/*', '');

        acc[currentKey] = path.resolve(
            rootPath,
            tsConfig.compilerOptions.baseUrl,
            pathForCurrentAlias
        );

        return acc;
    }, defaultAliases);
}

module.exports = function({ checkCircular }, { mode }) {
    const isDevMode = mode !== 'production';

    const plugins = [
        new HtmlWebpackPlugin({
            title: 'PuzzleGame',
            template: path.resolve(publicPath, 'index.html'),
        }),
        new webpack.EnvironmentPlugin({
            DEBUG: isDevMode
        }),
    ];

    if (checkCircular) {
        plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
            })
        )
    }

    return {
        mode,
        devtool: isDevMode ? 'source-map' : false,
        entry: './src/index.ts',
        output: {
            filename: '[name].[contenthash].js',
            assetModuleFilename: 'assets/[name].[hash][ext][query]',
            path: outputPath,
            clean: true,
        },
        optimization: {
            emitOnErrors: isDevMode,
            minimize: !isDevMode,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: false,
                        compress: false,
                        output: {
                            ascii_only: true
                        },
                    },
                })
            ],
        },
        resolve: {
            extensions: ['.js', '.ts'],
            alias: buildAliases()
        },
        module: {
            rules: [{
                test: /\.(j|t)s$/,
                use: "ts-loader",
                exclude: /node_modules/
            }, {
                test: /\.(png|ttf|mp3|m4a|ogg|wav)/,
                type: 'asset/resource'
            }]
        },
        plugins
    }
}

