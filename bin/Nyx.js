#!/usr/bin/env node
const {Command} = require('commander');
const {spawn} = require('child_process');
const path = require('path');
const pkg = require('../package.json');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const {createSpinner} = require('nanospinner');

//const sleep = (ms=1000) => new Promise(resolve => setTimeout(resolve, ms));

class Nyx {
    START_MESSAGE_DEFAULT_DEV = "Execution running in DEVELOPMENT mode....";
    DEV_MSG_WATCH = "Execution running in DEVELOPMENT and WATCHING mode....";
    DEV_SERVER_MSG = "Development server running on port: 5050....";
    FINAL_PROD_MSG = "Execution running in FINAL PRODUCTION mode....";

    constructor() {
        this.boot = false;
        this.program = new Command();
        this.browserCmdSript = [];
        this.serverCmdSript = [];
        this.spinner = null;
        this.browScriptFile = path.relative(process.cwd(), 'nyx.browser.js');
        this.serverScriptFile = path.relative(process.cwd(), 'nyx.server.js');
    }

    figletConf(str, font, width) {
        const options = {
            font: font,
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
            width: width,
            whitespaceBreak: true
        };

        return figlet.textSync(str, options);
    }

    async run() {
        const name = this.figletConf("nyx", "3D Diagonal", 80);
        this.program.name(gradient.rainbow(name))
            .description('A tool for compiling and bundling front-end code')
            .version(pkg.version);

        //command for building project in development mode
        this.program.command('build <mode>').description("run project in any specified mode 👨💻")
            .action((mode, options, cmd) => {
                //console.log(`${mode} ${options.watch} ${cmd.name()}`);
                this.execute(cmd, mode, options);
            });

        this.program.command("ssr <mode>").description("run runtime side rendering scripts")
            .option('-W --watch', "watch mode helps you to prevent run command everytime", false)
            .action((mode, options, cmd) => {
                this.execute(cmd, mode, options);
            });

        this.program.command("csr <mode>").description("run client side rendering scripts")
            .option('-W --watch', "watch mode helps you to prevent run command everytime", false)
            .option('-S --serve', "start dev server for client side.", false)
            .action((mode, options, cmd) => {
                this.execute(cmd, mode, options);
            });

      await this.program.parseAsync(process.argv);
    }

    async execute(cmd, mode="prod", options= {}) {
        const name = cmd.name();
        let cmdScript = null;
        //
        // console.log(options);
        // return;

        //this will help us to create spinner
        const optns = {
            cmdname: name,
            mode: mode,
            watch: options.watch,
            serve: options.serve
        }
        //checking command
        if (name === "build") {
            this.browserCmdSript.push("webpack", "--configuration", this.browScriptFile);
            this.serverCmdSript.push("webpack", "--configuration", this.serverScriptFile);
            this.csrCmdConfig(optns);
            this.ssrCmdConfig(optns);

            cmdScript = `${this.browserCmdSript.join(" ")} && ${this.serverCmdSript.join(" ")}`;

            //true boot for execution
            this.boot = true;
        }else if(name === "ssr") {
            this.serverCmdSript.push("webpack", "--configuration", this.serverScriptFile);
            this.ssrCmdConfig(optns);

            cmdScript = this.serverCmdSript.join(" ");

            //true boot for execution
            this.boot = true;
        }else if(name === "csr") {
            //checking whether serve option is passed or not
            optns.serve ? this.browserCmdSript.push("webpack-dev-server", "--configuration", this.browScriptFile) : this.browserCmdSript.push("webpack", "--configuration", this.browScriptFile);

            this.csrCmdConfig(optns);

            cmdScript = this.browserCmdSript.join(" ");

            //true boot for execution
            this.boot = true;
        }

        //run command...................
           await this.runCommand(cmdScript, (code) => {

               if(!code) {
                   this.buildSuccess(code);
                   process.exit(code);
               }else {
                   this.buildError(code);
                   process.exit(code);
               }
               }, optns);
    }

    ssrCmdConfig({mode, watch}) {
        if(mode === "dev") {
            this.serverCmdSript.push("--mode=development");

            if(watch)this.serverCmdSript.push("--watch");
        }else if(mode === "prod") {
            this.serverCmdSript.push("--mode=production");

            if(watch) this.serverCmdSript.push("--watch");
        }
    }

    csrCmdConfig({mode, watch}) {
        if(mode === "dev") {
            this.browserCmdSript.push("--mode=development");

            if(watch) this.browserCmdSript.push("--watch");
        }else if(mode === "prod") {
            this.browserCmdSript.push("--mode=production");

            if(watch) this.browserCmdSript.push("--watch");
        }
    }

    async runCommand(cmd, callback, optns = {}) {
        if(!this.boot) callback(420);

        const childProcess = spawn(cmd, {
            stdio: "inherit",
            shell: true,
            env: {
                ...process.env
            }
        })

        childProcess.on('spawn', () => {
            this.spawnListener(optns);
        });

        childProcess.on('exit', ((code, signal) => {
            callback(code);
        }))
    }

    spawnListener(optns) {
        const {cmdname, mode, watch, serve} = optns;

        if(cmdname === "build" || cmdname === "ssr" || cmdname === "csr") {
            if(mode === "dev") {

                if(watch) this.cmdSpinner(this.DEV_MSG_WATCH);
                else if(serve) this.cmdSpinner(this.DEV_SERVER_MSG);
                else this.cmdSpinner(this.START_MESSAGE_DEFAULT_DEV);

            }else if(mode === "prod") {
                this.cmdSpinner(this.FINAL_PROD_MSG);
            }
        }
    }

    cmdSpinner(msg) {
        this.spinner = createSpinner(gradient(["#FE3456", "#851E45"])(msg)).start();
    }

    buildSuccess(idf) {
        const s_msg =  gradient.rainbow(`Build Successfully. Process exit code ${idf}`);
        this.spinner.success({text: s_msg, mark: chalk.cyanBright('✔✔✔')});
    }

    buildError(idf) {//idf = identifier
        const err_msg = gradient(['#FF0000', '#00FF00', '#0000FE'])(`Something went wrong. Process exit code ${idf}`);
        this.spinner.error({text: err_msg, mark: chalk.red('❌❌❌')});
    }
}

//creating nyx terminal instance
new Nyx().run().catch(err => {
    console.log(gradient.rainbow(err));
})