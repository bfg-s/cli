module.exports = class MakeProvider extends Command {

    get signature () {

        this.command = "command:name";
        this.description = "A new Bfg command";
        this.parameters = "";

        return "make:command " +
            "{name The name of the class} " +
            "{-c|--command=? The terminal command that should be assigned [default: \"command:name\"]} " +
            "{-p|--parameters=? The terminal command parameters signature [default: \"\"]} " +
            "{-d|--description=? The terminal command description [default: \"A new Bfg command\"]} " +
            "Create a new Bfg command";
    }

    handle () {

        this.camel_name = app.str.camel(this.name, true);
        this.class_name = `${this.camel_name}${app.config.command_postfix}`;
        this.dir = app.help.base_path(app.config.command_path);
        this.file = `${this.dir}/${this.class_name}.${app.config.exts[app.config.syntax]}`;

        if (this.is_file(this.file)) {

            this.exit(`Command [${this.class_name}] is exists!`);
        }

        app.help.file_put_contents(this.file, this.stub('{__dirname}/../stubs/command', {
            'command_name': this.command,
            'description': this.description,
            'parameters': this.parameters ? ` ${this.parameters}` : '',
            'camel_name': this.camel_name,
            'class_name': this.class_name,
            'postfix': app.config.command_postfix,
            'path': app.config.command_path,
            'name': this.name,
            'dir': this.dir
        }));

        this.info(`Command [${app.config.command_path}/${this.class_name}] created!`);
    }
}