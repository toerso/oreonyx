const File = require('./File');
const BrowserPlugins = require('./plugins/BrowserPlugins');
const ServerPlugins = require('./plugins/ServerPlugins');
const BrowserModules = require('./modules/BrowserModules');
const ServerModules = require('./modules/ServerModules');
const Optimization = require('./plugins/Optimization');
const Extra = require('./Extra');

class WebpackConfig {
    #PublicPath;
    #Hash;
    #ServerPluginObj;
    #ExtraObj;
    #EntryPath;
    #Host;

    constructor() {
        this.webpackConfig = {};
        this.#Hash = 'contenthash';
        this.#PublicPath = '/';
        this.file = new File();
        this.browserPluginsObj = new BrowserPlugins();
        this.#ServerPluginObj = new ServerPlugins();
        this.browserModulesObj = new BrowserModules();
        this.serverModulesObj = new ServerModules();
        this.optimizationObj = new Optimization();
        this.#ExtraObj = new Extra();
    }

    mode(mode="production") {
        if(!this.webpackConfig.hasOwnProperty('mode')) this.webpackConfig.mode = mode;
    }

    target(target) {
        if(!this.webpackConfig.hasOwnProperty('target')) this.webpackConfig.target = target;
    }

    name(name) {
        if(!this.webpackConfig.hasOwnProperty('name')) this.webpackConfig.name = name;
    }


    publicPath(hostname, dir = "") {
        this.#Host = hostname;
        this.#PublicPath = `${hostname}/${dir}`;
    }

    devTool() {
        this.webpackConfig.devtool = this.webpackConfig.mode === "development" ? "eval" : 'none';
    }

    entry(filepath) {
        this.#EntryPath = filepath;

        if(typeof(filepath) === "string") {
            this.webpackConfig.entry = filepath;//this.file.relative_path(filepath);
        }else {
            this.webpackConfig.entry = {}

            for (const file of filepath) {
                const basename = this.file.file_basename(file);
                this.webpackConfig.entry[basename] = this.file.relative_path(file);
            }
        }
    }

    async browserOutput() {
        const outputPath = this.file.resolve_path('public/assets');

        if(this.webpackConfig.target !== "web") throw Error("Target must be web :_(");

        this.webpackConfig.output = {
            publicPath: this.#PublicPath,
            path: outputPath,
            filename: `js/oreonyx.[name].[${this.#Hash}].js`,
            clean: true
        }
    }

    async serverOutput() {
        const outputPath = this.file.resolve_path('runtime/ssr');

        if(this.webpackConfig.target !== "node") throw Error("Target must be node :_(");

        this.webpackConfig.output = {
            publicPath: this.#PublicPath,
            path: outputPath,
            filename: `server.js`,
            clean: true
        }
    }

    browserModules() {
        this.browserModulesObj.setupHtml();
        this.browserModulesObj.setupBabel();
        this.browserModulesObj.setupCss();
        this.browserModulesObj.setupSass();
        this.browserModulesObj.setupImageFile();
        this.browserModulesObj.setupFont();
        this.browserModulesObj.setupAudio();
        this.browserModulesObj.setupVideo();
        this.webpackConfig.module = this.browserModulesObj.module;
    }

    //runtime modules goes here---------------
    serverModules() {
        this.serverModulesObj.setupHtml();
        this.serverModulesObj.setupBabel();
        this.serverModulesObj.setupCss();
        this.serverModulesObj.setupSass();
        this.serverModulesObj.setupImageFile();
        this.serverModulesObj.setupFont();
        this.serverModulesObj.setupAudio();
        this.serverModulesObj.setupVideo();
        this.serverModulesObj.setupSsrStripBlock();
        this.webpackConfig.module = this.serverModulesObj.module;
    }

    //For browser content
    browserPlugins(props) {
        let filename = `${this.file.extract_src_dir(this.#EntryPath)}/main.croxo.php`;

        if(props) {
            if(props.ext === "html" && props.dir === "self") filename = `${this.file.extract_src_dir(this.#EntryPath)}/index.html`;
            else if(props.ext === "html" && props.dir === "dist") filename = "public/index.html";
        }

        const propertiesOfHtmlWebpackPlugin = {
            template: "./template.html",
            filename: filename,
            inject: 'body',
            scriptLoading: "defer",
        }

        const propertiesOfMiniCssPlugin = {
            filename: 'css/oreonyx.[name].[contenthash].css'
        }

        //setting plugins properties
        this.browserPluginsObj.htmlWebpackPlugin(propertiesOfHtmlWebpackPlugin);
        this.browserPluginsObj.miniCssExtractPlugin(propertiesOfMiniCssPlugin);

        this.webpackConfig.plugins = this.browserPluginsObj.plugins;
    }

    serverPlugins() {
        this.webpackConfig.plugins = this.#ServerPluginObj.miniCssExtractPlugin({filename: 'css/oreonyx.[name].[contenthash].css'}).plugins;
    };

    devServer(devserver) {
            if(!devserver) return;

            this.webpackConfig.devServer = {
                static: {
                    directory: this.file.resolve_path('public')
                },
                host: "localhost",
                port: 5050,
                hot: true,
                open: true
            }
    }

    //code splitting.............................
    optimization() {
        this.optimizationObj.splitChunk();

        //get full optimization property
        this.webpackConfig.optimization = this.optimizationObj.optimization;
    }

    externals() {
        this.webpackConfig.externals = [this.#ExtraObj.nodeExternals()];
    }

    resolve(extns) {
        if(!this.webpackConfig.hasOwnProperty('resolve')) this.webpackConfig.resolve = {extensions:[...extns]};
    }
}

module.exports = WebpackConfig;