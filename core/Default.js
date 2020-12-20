module.exports = class Default extends Command {

    async handle () {

        this.show_version();

        this.line().line('Usage:')
            .scheme([['', '', 'command [options] [arguments]']])
            .line()
            .comment('Available commands:');

        this.scheme(app.commands.map((cmd) => {
            return ['', '', String(cmd.name).green, '', cmd.description];
        }));
    }
}