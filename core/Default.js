module.exports = class Default extends Command {

    async handle () {

        let out = await this.cmd(`cd ${app.fs.path(__dirname, '..')} && git tag`);
        let ver = out.length ? app.obj.last(out) : '1.0.0';

        this.line('Bfg ' + String('v' + ver).green)
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