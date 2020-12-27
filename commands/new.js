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

        let root_npm_packages = {
            'bfg-cli': 'git@github.com:bfg-s/cli.git',
            'bfg-js': 'git@github.com:bfg-s/bfg-js.git',
            'bfg-node': 'git@github.com:bfg-s/node.git',
            'bfg-schema': 'git@github.com:bfg-s/schema.git',
            'bfg-vue': 'git@github.com:bfg-s/vue.git',
        };

        if (admin) {
            composer_packages.push('bfg/admin');
        }

        await this.signed_exec(
            `Installing and configuration of Laravel...`,
            `composer create-project laravel/laravel .`
        );

        await this.signed_exec(
            `Installing and configuring BFG packages with composer...`,
            `composer require ${composer_packages.join(' ')} ${this.root ? '--prefer-source':''}`
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
                `npm install ${Object.keys(root_npm_packages).join(' ')} --save-dev`
            );
        } else {
            app.fs.mkdir(
                app.fs.base_path('bfg-js')
            );
            await Promise.all(Object.keys(root_npm_packages).map(async (pac) => {
                let repo = root_npm_packages[pac];
                await this.signed_exec(
                    `Clone [${repo}]...`,
                    `git clone ` + repo,
                    app.fs.base_path('bfg-js')
                );
            }));
        }
        app.fs.mkdir(app.fs.base_path('resources/js/components'));
        app.fs.mkdir(app.fs.base_path('app/Components'));

        await this.put_stub('resources/js/app.js', 'resources_js_app_js');
        await this.put_stub('resources/js/components.js', 'resources_js_components_js');
        await this.put_stub('webpack.mix.js', 'webpack_mix_js');
        await this.put_stub('tsconfig.json', 'tsconfig_json');
        await this.put_stub('app/Layouts/DefaultLayout.php', 'app_Layouts_DefaultLayout_php');
        await this.put_stub('app/Http/Controllers/HomeController.php', 'app_Layouts_DefaultLayout_php');
        await this.put_stub('routes/web.php', 'routes_web_php');

        if (this.root) {

            await this.put_stub('bfg.json', 'bfg_json');

            await this.signed_exec(
                `Vendor link create...`,
                `ln -s ${app.fs.base_path('vendor', 'bfg')} ${app.fs.base_path('bfg')}`
            );
            await Promise.all(Object.keys(root_npm_packages).map(async (p) => {
                await this.signed_exec(
                    `JS [${p}] Generation of a special link...`,
                    `npm ln`, app.fs.base_path('bfg-js', p)
                );
            }))
            await Promise.all(Object.keys(root_npm_packages).map(async (p) => {
                await this.signed_exec(
                    `JS [${p}] Integration of the link into the current project...`,
                    `npm ln ${p}`
                );
            }))
            await Promise.all(Object.keys(root_npm_packages).map(async (p) => {
                await this.signed_exec(
                    `JS [${p}] Installing development environment dependencies...`,
                    `npm install`,
                    app.fs.base_path('bfg-js', p)
                );
            }))
        }

        this.info('Bfg project created!');
    }

    async put_stub (file, stab) {
        await app.fs.put_contents(
            app.fs.base_path(file),
            app.fs.get_contents(path.join(__dirname, 'Stubs', stab + ".stub"))
        );
    }
}