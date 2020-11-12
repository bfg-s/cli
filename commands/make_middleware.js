module.exports = class MakeMiddleware extends Command {

    get signature () {
        return "make:middleware {name The name of the class} Create a new middleware class";
    }

    handle () {

        this.camel_name = app.str.camel(this.name, true);
        this.class_name = `${this.camel_name}${app.config.middleware_postfix}`;
        this.dir = app.fs.base_path(app.config.middleware_path);
        this.file = `${this.dir}/${this.class_name}.${this.ext}`;

        if (app.fs.is_file(this.file)) {

            this.exit(`Middleware [${this.class_name}] is exists!`);
        }

        app.fs.put_contents(this.file, this.stub([__dirname, '..', 'stubs/middleware'], {
            'camel_name': this.camel_name,
            'class_name': this.class_name,
            'postfix': app.config.middleware_postfix,
            'path': app.config.middleware_path,
            'name': this.name,
            'dir': this.dir
        }));

        this.info(`Middleware [${app.config.middleware_path}/${this.class_name}] created!`);
    }
}