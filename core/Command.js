const Table = require('cli-table3');
const loading =  require('loading-cli');
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const { exec } = require('child_process');

function promiseFromChildProcess(child, out = []) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
        child.stdout.on("data", (d) => out.push(d.trim().split(/\n/g)));
    });
}

module.exports = class Command {

    success (text) {
        this.process(text.green).start().succeed();
        return this;
    }

    fail (text) {
        this.process(text.red).start().fail();
        return this;
    }

    warn (text) {
        this.process(text.yellow).start().warn();
        return this;
    }

    async signed_exec (title, command) {
        command = Array.isArray(command) ? command.join(' ') : command;
        let out = [],
            process = this.process({}).start(title);

        try {
            await this.exec(command, out);
            process.succeed();
        } catch (e) {
            process.fail(e.message);
        }

        return out.flat();
    }

    async exec (command, out = []) {
        return await promiseFromChildProcess(exec(command), out);
    }

    async cmd (command) {
        let out = [];
        await this.exec(command, out);
        return out.flat();
    }

    async ask (question, defaultValue = null, validate) {
        let result = await this.prompts({
            type: 'text',
            name: 'value',
            message: question,
            initial: defaultValue,
            validate: validate
        });
        return result.value
    }

    async confirm (message, defaultValue = true, active = 'yes', inactive = 'no') {
        let result = await this.prompts({
            type: 'toggle',
            name: 'value',
            message: message,
            initial: defaultValue,
            active, inactive
        });
        return result.value
    }

    async prompts (options) {
        return await prompts(options);
    }

    get ext () {
        return app.config.syntax in app.config.exts ? app.config.exts[app.config.syntax] : 'js';
    }

    stub (file, params = {}) {

        file = Array.isArray(file) ? app.fs.path(...file) : file;
        file += `/${app.config.syntax}.stub`;

        if (!app.fs.is_file(file)) {
            app.die(`File template [${file}] not found!`);
        }

        return app.str.replace_tags(
            app.fs.get_contents(file), params
        );
    }

    process (options) {
        return loading(options)
    }

    table (rows, options = {}) {
        let table = new Table(options);
        table.push(...rows);
        console.log(table.toString());
        return this;
    }

    scheme (rows, options = {}) {
        options.chars = { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
            'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
            'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
            'right': '' , 'right-mid': '' , 'middle': ' '};
        options.style = { 'padding-left': 0, 'padding-right': 0 };
        this.table(rows, options);
        return this;
    }

    comment (...data) {
        data = data.map(p => typeof p === 'string' ? (p.yellow) : p);
        this.line(...data);
        return this;
    }

    info (...data) {
        data = data.map(p => typeof p === 'string' ? (p.green) : p);
        this.line(...data);
        return this;
    }

    error (...data) {
        data = data.map(p => typeof p === 'string' ? (p.white.bgRed) : p);
        this.line(...data);
        return this;
    }

    exit (message, code = 0) {
        return app.die(message, code);
    }

    line (...data) {
        console.log(...data);
        return this;
    }

    show_help () {
        let has_options = false;
        let args = 'params' in this ? this.params.map((param) => {
            return param.arg ? param.name : false;
        }).filter(i => i !== false) : [];
        let opts = 'params' in this ? this.params.filter((param) => {
            return !param.arg;
        }) : [];
        let args_info = args.length ? `<${args.join('> <')}>` : '';
        let opts_info = opts.length ? ` [options] [--]` : '';

        this.comment('Description:')
            .scheme([['', '', this.description]])
            .line()
            .comment('Usage:')
            .scheme([['', '', `${this.name}${opts_info} ${args_info}`]]);

        if (args.length) {
            this.line()
                .comment('Arguments:');
            let args = [];
            this.params.map((param) => {
                if (param.arg) {
                    args.push(['', '', String(param.name).green, '', param.description]);
                }
            });
            this.scheme(args);
        }
        this.line()
            .comment('Options:');
        let options = [];

        if (opts.length) {
            this.params.map((param) => {
                if (!param.arg) {
                    let a = param.aliases.filter(i => !!i);
                    options.push(['', '',
                        a.length ? String(a.map(i => `-${i}`).join(', ') + ", ").green : "",
                        String('--'+param.name).green, '', param.description
                    ]);
                }
            });
        }
        options.push(
            ['', '', String('-h,').green, String('--help').green, '', 'Display this help message'],
            ['', '', String('-q,').green, String('--quiet').green, '', 'Do not output any message'],
            ['', '', String('-v,').green, String('--version').green, '', 'Display this application version'],
            ['', '', String('--v|vv|vvv,').green, String('--verbose').green, '', 'Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug']
        );
        this.scheme(options);
    }
}