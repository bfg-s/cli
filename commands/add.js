const path = require('path');

module.exports = class TestCommand extends Command {

    get signature () {

        this.type = 'simple';

        return "add " +
            "{type? Type of creation [default: simple][admin]} " +
            "Add bfg technologies to project";
    }

    async handle () {

        let admin = this.type === 'admin';

        let composer_packages = [
            'bfg/dev', 'bfg/entity', 'bfg/layout', 'bfg/route', 'bfg/ui'
        ];

        let root_npm_packages = {
            'bfg-js': 'git@github.com:bfg-s/bfg-js.git',
            'bfg-node': 'git@github.com:bfg-s/node.git',
            'bfg-cli': 'git@github.com:bfg-s/cli.git',
            'bfg-schema': 'git@github.com:bfg-s/schema.git',
            'bfg-vue': 'git@github.com:bfg-s/vue.git',
        };

        if (admin) {
            composer_packages.push('bfg/admin');
        }

        if (!app.fs.is_dir(app.fs.base_path('vendor')) || !app.fs.is_dir(app.fs.base_path('vendor/laravel/framework/src'))) {

            this.exit('Laravel not found!');
        }

        await this.signed_exec(
            `Installing and configuring BFG packages with composer...`,
            `composer require ${composer_packages.join(' ')} ${this.root ? '--prefer-source':''}`
        );

        await this.signed_exec(
            `Installing JavaScript dependencies...`,
            `npm install`
        );

        await this.signed_exec(
            `Installing and configuring BFG packages with npm...`,
            `npm install ${Object.keys(root_npm_packages).join(' ')} --save-dev`
        );

        if (!app.fs.is_dir(app.fs.base_path('resources/js/components'))) {

            app.fs.mkdir(app.fs.base_path('resources/js/components'));
        }

        if (!app.fs.is_dir(app.fs.base_path('app/Components'))) {

            app.fs.mkdir(app.fs.base_path('app/Components'));
        }

        await this.put_stub('resources/js/app.js', 'new/resources_js_app_js');
        await this.put_stub('webpack.mix.js', 'new/webpack_mix_js');
        await this.put_stub('app/Layouts/DefaultLayout.php', 'new/app_Layouts_DefaultLayout_php');

        if (!app.fs.is_file(app.fs.base_path('app/Http/Controllers/HomeController.php'))) {
            await this.put_stub('app/Http/Controllers/HomeController.php', 'new/app_Http_Controllers_HomeController_php');
        }

        await this.put_stub('routes/web.php', 'new/routes_web_php');

        if (admin) {

            await this.signed_exec(
                `Installing BFG Admin...`,
                `php artisan admin:install -f`
            );
        }

        this.info('Bfg technologies added!');
    }
}