const Table = require('cli-table3');
const loading =  require('loading-cli');
const fs = require('fs');
const path = require('path');

module.exports = class Command {

    is_file (file) {
        return fs.existsSync(file);
    }

    script_path (path = null) {
        return path.resolve(__dirname, '..', path);
    }

    get ext () {
        return app.config.syntax in app.config.exts ? app.config.exts[app.config.syntax] : 'js';
    }

    stub (file, params = {}) {

        file = file.replace('{base_path}', app.help.base_path()).replace('{__dirname}', __dirname);
        file += `/${app.config.syntax}.stub`;

        if (!fs.existsSync(file)) {

            app.help.die(`File template [${file}] not found!`);
        }

        let tpl = fs.readFileSync(file).toString();

        Object.keys(params).map(k => {
            tpl = tpl.replace(new RegExp(`\{${k}\}`, 'g'), params[k]);
        });

        return tpl;
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
        return app.help.die(message, code);
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