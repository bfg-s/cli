module.exports = class Default extends Command {

    handle () {

        this.line('Bfg ' + String('v' + app.version).green)
            .line()
            .line('Usage:')
            .scheme([['', '', 'command [options] [arguments]']])
            .line()
            .comment('Available commands:');

        this.scheme(app.commands.map((cmd) => {
            return ['', '', String(cmd.name).green, '', cmd.description];
        }));
    }
}