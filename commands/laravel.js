const path = require('path');
const commandExists = require('command-exists').sync;

module.exports = class NewLaravelCommand extends Command {

    get signature () {

        return "laravel {name: Name of project} Create new laravel project";
    }

    async handle () {

        const php_command_exists = commandExists('php');

        if (!php_command_exists) {

            this.comment("Warning! Install PHP. See: https://php.net");

            return 1;
        }

        const composer_command_exists = commandExists('composer');

        if (!composer_command_exists) {

            this.comment("Warning! Install Composer. Run: \n\n" +
                'php -r "copy(\'https://getcomposer.org/installer\', \'composer-setup.php\');"' + "\n" +
                'php composer-setup.php' + "\n" +
                'php -r "unlink(\'composer-setup.php\');"' + "\n" +
                'sudo mv composer.phar /usr/local/bin/composer' + "\n"
            );

            return 1;
        }

        const laravel_command_exists = commandExists('laravel');

        if (!laravel_command_exists) {

            this.comment('Warning! Install Laravel CLI. Run: "composer global require laravel/installer"');

            return 1;
        }

        await this.signed_exec(
            `Installing Laravel...`,
            `laravel new ${this.name}`
        );

        await this.signed_exec(
            `Updating Composer dependencies...`,
            `composer update`,
            app.fs.base_path(this.name)
        );

        app.fs.mkdir(app.fs.base_path(`${this.name}/runtimes/dev`));

        await this.put_stub(`${this.name}/runtimes/dev/Dockerfile`, 'laravel/runtimes/dev/Dockerfile');
        await this.put_stub(`${this.name}/runtimes/dev/php.ini`, 'laravel/runtimes/dev/php_ini');
        await this.put_stub(`${this.name}/runtimes/dev/start-container`, 'laravel/runtimes/dev/start_container');
        await this.put_stub(`${this.name}/runtimes/dev/supervisord.conf`, 'laravel/runtimes/dev/supervisord');

        await this.put_stub(`${this.name}/docker-compose.yml`, 'laravel/docker_compose', {
            name: this.name
        });

        this.comment("Commands to complete the installation: \n" +
            `cd ./${this.name} && ./vendor/bin/sail up -d`);
    }
}
