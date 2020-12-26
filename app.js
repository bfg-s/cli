globalThis.Command = require('./core/Command');
const ArgsParse = require('./core/ArgsParse');
const Default = require('./core/Default');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', () => {
    process.exit();
});

let app = require('bfg-js').default;

app.provider({
    register() {
        this.app.execute('globalize');
        this.app.register(require('bfg-node'));
        this.app.bind('cmd', require('./cmd'));
        this.app.bind('args', new ArgsParse());
        this.app.bind('config', require('./config'));
        this.app.bind('default', new Default);
        this.app.bind('commands', []);
        this.app.bind('command_dirs', () => {
            let commands = app.config.commands;
            commands = commands.map(dir => app.fs.base_path(dir));
            commands.unshift(app.fs.path(__dirname, 'commands'));
            return commands;
        }, true);
        this.app.bind('die', (text = null, code = 0) => {
            if (text !== null) console.log(String(text).bgRed.white);
            process.exit(code);
        });
        this.app.bind('error', (text) => {
            console.error(String(text).bgRed.white);
        });
        this.app.cmd.modules();
        let with_mix = false;
        if (this.app.fs.is_dir(this.app.fs.base_path('node_modules/laravel-mix'))) {
            with_mix = true;
        }
        this.app.bind('with_mix', with_mix);
    },
    boot() {
        this.app.cmd.inject_files();
    }
});

app.boot();

module.exports = app.cmd.call;