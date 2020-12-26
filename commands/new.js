const path = require('path');

module.exports = class TestCommand extends Command {

    get signature () {

        this.type = 'admin';

        return "new " +
            "{type? Type of creation [default: admin][simple]} " +
            "{-r|--root? Create develop of bfg} " +
            "Project generator";
    }

    async handle () {

        let admin = this.type === 'admin';

        let composer_packages = [
            'bfg/dev', 'bfg/entity', 'bfg/layout'
        ];

        let npm_packages = [
            'bfg-cli', 'bfg-js', 'bfg-node', 'bfg-schema', 'bfg-vue'
        ];

        let root_npm_packages = [
            'bfg-cli', 'bfg-js', 'bfg-node', 'bfg-schema', 'bfg-vue'
        ];

        if (admin) {

            composer_packages.push('bfg/admin');
        }

        await this.signed_exec(
            `Installing and configuration of Laravel...`,
            `composer create-project laravel/laravel .`
        );
        await this.signed_exec(
            `Installing and configuring BFG packages with composer...`,
            `composer require ${composer_packages.join(' ')} ${this.root ? '-—prefer-source':''}`
        );
        await this.signed_exec(
            `Installing JavaScript dependencies....`,
            `npm install`
        );
        await this.signed_exec(
            `Installing VueJs3 components...`,
            `npm install @types/webpack-env @vue/compiler-sfc vue-loader@next laravel-mix-vue3 --save-dev`
        );
        if (!this.root) {
            await this.signed_exec(
                `Installing and configuring BFG packages with npm...`,
                `npm install ${npm_packages.join(' ')} --save-dev`
            );
        } else {
            await this.signed_exec(
                `Installing and configuring BFG packages with npm...`,
                `npm install ${root_npm_packages.join(' ')} --save-dev`
            );
        }

        app.fs.put_contents(
            app.fs.base_path('resources/js/app.js'),
            this.get_stub('resources_js_app_js')
        );

        app.fs.put_contents(
            app.fs.base_path('resources/js/components.js'),
            this.get_stub(`resources_js_components_js`));

        app.fs.mkdir(
            app.fs.base_path('resources/js/components')
        );

        app.fs.put_contents(
            app.fs.base_path('webpack.mix.js'),
            this.get_stub('webpack_mix_js'));

        app.fs.put_contents(
            app.fs.base_path('tsconfig.json'),
            this.get_stub('tsconfig_json'));

        app.fs.put_contents(
            app.fs.base_path('app/Layouts/DefaultLayout.php'),
            this.get_stub('app_Layouts_DefaultLayout_php'));

        app.fs.mkdir(
            app.fs.base_path('app/Components')
        );

        app.fs.put_contents(
            app.fs.base_path('app/Http/Controllers/HomeController.php'),
            this.get_stub('app_Layouts_DefaultLayout_php'));

        app.fs.put_contents(
            app.fs.base_path('routes/web.php'),
            this.get_stub('routes_web_php'));

        if (this.root) {

            app.fs.put_contents(
                app.fs.base_path('bfg.json'),
                this.get_stub('bfg_json'));

            await this.signed_exec(`Vendor link create...`, `ln -s ${app.fs.base_path('vendor', 'bfg')} ${app.fs.base_path('bfg')}`);
            app.fs.mkdir(
                app.fs.base_path('bfg-js')
            );
            await Promise.all(npm_packages.map(async (p) => {
                await this.signed_exec(`JS [${p}] Moving to the working directory...`, `mv ${app.fs.base_path('node_modules', p)} ${app.fs.base_path('bfg-js', p)}`);
                await this.signed_exec(`JS [${p}] Generation of a special link...`, `npm ln`, app.fs.base_path('bfg-js', p));
                await this.signed_exec(`JS [${p}] Integration of the link into the current project...`, `npm ln ${p}`);
                await this.signed_exec(`JS [${p}] Installing development environment dependencies...`, `npm install`, app.fs.base_path('bfg-js', p));
            }))
        }

        await this.signed_exec(`Run JavaScript production....`, `npm run prod`);

        this.info('Bfg project created!');
    }

    get_stub (stab) {
        return app.fs.get_contents(path.join(__dirname, 'Stubs', stab + ".stub"));
    }
}