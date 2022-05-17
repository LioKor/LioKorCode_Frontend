const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = env => {
    const proxyTo = (env.local)? 'http://localhost:9091': 'https://code.liokor.com/'

    return {
        entry: './src/index.js',
        output: {
            filename: '[name].[contenthash].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            clean: true
        },
        performance: {
            maxAssetSize: 368640
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                favicon: 'src/images/favicon.ico'
            }),
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                BUILD_TIMESTAMP: Date.now(),
                VERSION: JSON.stringify(require('./package.json').version)
            })
        ],
        devServer: {
            port: 9000,
            historyApiFallback: {
                rewrites: [
                    {
                        from: /.(js|png|ico|svg|gif|mp3)$/,
                        to: (context) => {
                            const path = context.parsedUrl.pathname.split('/')
                            return `/${path[path.length - 1]}`
                        }
                    },
                    { from: /^\/#/, to: '/index.html' },
                ]
            },
            proxy: {
                '/api/v1': {
                    target: proxyTo,
                    secure: false,
                    changeOrigin: true
                },
                '/media': {
                    target: proxyTo,
                    secure: false,
                    changeOrigin: true
                }
            }
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: [
                        'vue-loader',
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|mp3|svg|gif)$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.worker.js$/,
                    use: { loader: 'worker-loader' }
                },
                {
                    test: /\.styl(us)?$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
                {
                    test :/\.exec\.js$/,
                    use: 'script-loader'
                }
            ],
        }
    }
};
