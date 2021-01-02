module.exports = class MakeVue extends Command {

    get signature () {

        return "make:vue " +
            "{name The name of the class} " +
            "Create a new Bfg command";
    }

    handle () {

        this.camel_name = app.str.camel(this.name, true);
        this.class_name = this.camel_name;
        this.dir = app.fs.base_path();
        this.file = `${this.dir}/${this.class_name}.vue`;

        if (app.fs.is_file(this.file)) {

            this.exit(`Vue [${this.class_name}] is exists!`);
        }

        app.fs.put_contents(this.file, this.stub([__dirname, '..', 'stubs/vue'], {
            'command_name': this.command,
            'description': this.description,
            'parameters': this.parameters ? ` ${this.parameters}` : '',
            'camel_name': this.camel_name,
            'class_name': this.class_name,
            'name': this.name,
            'dir': this.dir
        }));

        this.info(`Vue component [${this.camel_name}.vue] created!`);
    }
}