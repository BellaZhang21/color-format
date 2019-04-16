// webpack.dll.js
const webpack = require('webpack')
const path = require('path')
const vendors = [
    'vue',
    'vue-loader',
    'axios',
    'element-ui',
    'xlsx',
    'echarts'
]

module.exports = {
     output: {
        path:  path.resolve(__dirname,'./dist'),
        filename:'[name].js',
        library: '[name]'
    },
    entry: {
        "lib": vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname
        }),
    ]
}