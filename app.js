globalThis.Command = require('./core/Command');
const ArgsParse = require('./core/ArgsParse');
const Default = require('./core/Default');
const fs = require('fs');

const default_configs = {
    syntax: "module",
    extend: "bfg.js",
    commands: "{base_path}/resources/js/commands",
    exts: {
        "module": "js",
        "export": "js",
        "ts": "js"
    },
    provider_postfix: "ServiceProvider",
    provider_path: "resources/js/providers",
    middleware_postfix: "Middleware",
    middleware_path: "resources/js/middlewares",
    command_postfix: "Command",
    command_path: "resources/js/commands",
};
require('bfg-js');

app.bind('help', require('./helpers'));
app.bind('args', new ArgsParse());
app.bind('config', require('./config')(app, default_configs));
app.bind('default', new Default);
app.bind('commands', []);
app.bind('command_dirs', () => {
    let commands = Array.isArray(app.config.commands) ? app.config.commands : [app.config.commands];
    commands.unshift('{__dirname}/commands');
    return commands.map(dir => dir.replace('{base_path}', app.help.base_path()).replace('{__dirname}', __dirname));
});

app.command_dirs.map((path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).map((file) => {
            let objectClass = require(`${path}/${file}`);
            try {
                objectClass = new objectClass();
            } catch (e) {
                app.help.error(e);
                return ;
            }
            objectClass = app.help.parse_signature(objectClass);
            if ('handle' in objectClass && 'name' in objectClass) {
                app.bind(objectClass.name, objectClass);
                app.commands.push(objectClass);
            }
        });
    }
});
