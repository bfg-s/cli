globalThis.Command = require('./core/Command');
const ArgsParse = require('./core/ArgsParse');
const Default = require('./core/Default');

require('bfg-js');

require('bfg-node');

app.provider({
    register() {
        app.bind('help', require('./helpers'));
        app.bind('args', new ArgsParse());
        app.bind('config', require('./config'));
        app.bind('default', new Default);
        app.bind('commands', []);
        app.compute('command_dirs', () => {
            let commands = Array.isArray(app.config.commands) ? app.config.commands : [app.config.commands];
            commands.unshift('{__dirname}/commands');
            return commands.map(dir => dir.replace('{base_path}', app.fs.path()).replace('{__dirname}', __dirname));
        });
        app.bind('die', (text = null, code = 0) => {
            if (text !== null) console.log(String(text).bgRed.white);
            process.exit(code);
        });
        app.bind('error', (text) => {
            console.error(String(text).bgRed.white);
        });
    },
    boot() {
        app.help.inject_files();
    }
});

app.boot();