module.exports = class MakeProvider extends Command {

    get signature () {

        return "make:provider {name The name of the class} Create a new service provider class";
    }

    handle () {

        this.camel_name = app.str.camel(this.name, true);
        this.class_name = `${this.camel_name}${app.config.provider_postfix}`;
        this.dir = app.help.base_path(app.config.provider_path);
        this.file = `${this.dir}/${this.class_name}.${app.config.exts[app.config.syntax]}`;

        if (this.is_file(this.file)) {

            this.exit(`Provider [${this.class_name}] is exists!`);
        }

        app.help.file_put_contents(this.file, this.stub('{__dirname}/../stubs/provider', {
            'camel_name': this.camel_name,
            'class_name': this.class_name,
            'postfix': app.config.provider_postfix,
            'path': app.config.provider_path,
            'name': this.name,
            'dir': this.dir
        }));

        this.info(`Provider [${app.config.provider_path}/${this.class_name}] created!`);
    }
}