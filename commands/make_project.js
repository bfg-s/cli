module.exports = class MakeVue extends Command {

    get signature () {

        this.type = "php";
        this.folders = "";

        return "make:project " +
            "{name The name of project} " +
            "{--folders|-f=? The folders to be specified can be recursively and separated by commas.} " +
            "{--type|-t=? Project type [Default: php][Can be php,js].} " +
            "Create a new project in current path";
    }

    handle () {

        if (this.type !== 'js' || this.type !== 'php') this.type = 'php';

        this.snake_name = app.str.snake(this.name, true);

        this.folders = this.folders.split(',');

        this.dir = app.fs.base_path(app.config.project.make[`path-${this.type}`], this.snake_name);

        if (app.fs.is_dir(this.dir)) {

            this.exit(`Project [${this.snake_name}] is exists!`);
        }

        this.folders.map((folder) => {
            if (!app.fs.is_dir(folder)) {
                app.fs.mkdir(folder);
            }
        });

        if (this.type==='php') {

        }

        this.info(`Project [${this.snake_name}] created!`);
    }


}