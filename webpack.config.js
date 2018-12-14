const path = require('path');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const args = require("cli-args")(process.argv.slice(2));
const env = args["env"];

switch (env) {
    case 'dist':
        entries = ['./src/js/main.js','./src/scss/base.scss']
        outputFolder = "dist";
        jsOutputFile = "[name].min.js";
        cssOutputFile = "[name].min.css";
        devMode = false;
        break;

    case 'dev':
        entries = ['./src/js/main.js','./src/scss/base.scss']
        outputFolder = "dev";
        jsOutputFile = "[name].js";
        cssOutputFile = "[name].css";
        devMode = true;
        break;

    default:
        throw new Error(`Env ${env} have be more specified in webpack.config.js`);
}


let conf = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, outputFolder),
        filename: jsOutputFile
    },
    devServer: {
        overlay: true,
        contentBase: outputFolder
    },
    watch: devMode,
    module: {
        rules: [{
                test: /\.handlebars$/,
                loader:'handlebars-loader',
                query: {
                    partialDirs: [
                        path.join(__dirname, 'src', 'html', 'partials')
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/,
                use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: cssOutputFile
                            }
                        },
                        {
                            loader: 'extract-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: devMode
                            }
                        }
                    ]
            }
        ]
    }, 
    optimization: {
        minimizer: [
           new OptimizeCSSAssetsPlugin({}),
           new UglifyJsPlugin()
        ]
      },
    devtool: 'eval-sourcemap'
    
};

module.exports = (env, options) => {
    let production = options.mode === 'production';

    conf.devtool = production ? false : 'eval-sourcemap';

    return conf;
}