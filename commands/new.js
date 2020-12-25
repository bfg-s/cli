module.exports = class TestCommand extends Command {

    get signature () {

        this.type = 'admin';

        return "new " +
            "{type? Type of creation [default: admin][simple]} " +
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

        if (admin) {

            composer_packages.push('bfg/admin');
        }

        await this.signed_exec(`Laravel install...`, `composer create-project laravel/laravel .`);
        await this.signed_exec(`Install bfg laravel packages...`, `composer require ${composer_packages.join(' ')}`);
        await this.signed_exec(`Install JavaScript packages...`, `npm install`);
        await this.signed_exec(`Install Vue3 packages...`, `npm install @types/webpack-env @vue/compiler-sfc vue-loader@next laravel-mix-vue3  --save-dev`);
        await this.signed_exec(`Install bfg JavaScript packages...`, `npm install ${npm_packages.join(' ')}`);

        app.fs.put_contents(
            app.fs.base_path('resources/js/app.js'),
            `const app = require('bfg-js').app;

app.vue = require('vue');

app.register(require('bfg-schema').default);
app.register(require('bfg-vue').default);

app.provider(require('./components'));
app.provider({
    register () {
        app.bind('dev', process.env.NODE_ENV === 'development');
        if (process.env.NODE_ENV === 'development') {
            app.execute('globalize');
        }
    }
});

app.boot();`);

        app.fs.put_contents(
            app.fs.base_path('resources/js/components.js'),
            `module.exports = {
    register(){
    }
};`);
        app.fs.mkdir(app.fs.base_path('resources/js/components'));

        app.fs.put_contents(
            app.fs.base_path('webpack.mix.js'),
            `const mix = require('laravel-mix');
require("laravel-mix-vue3");
require('bfg-cli')('vue:watch');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.vue3('resources/js/app.js', 'public/js/app.js')
    mix.postCss('resources/css/app.css', 'public/css');`);

        app.fs.put_contents(
            app.fs.base_path('tsconfig.json'),
            `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "moduleResolution": "node",
    "jsx": "preserve",
    "experimentalDecorators": true,
    "skipLibCheck": true
  },
  "include": [
    "resources/js/**/*"
  ],
  "exclude": [
    "node_modules",
    "vendor"
  ]
}`);
        this.info('Bfg project created!');
    }
}