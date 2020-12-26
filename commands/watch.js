module.exports = class TestCommand extends Command {

    constructor() {
        super();
        this.watches = {};
        app.singleton('chokidar', () => {
            return require('chokidar');
        });
        if (app.with_mix) {
            app.bind('watch', this);
            this.handle();
        }
    }

    get signature () {

        return "watch Run a watcher";
    }

    handle () {

        let file_extender = app.fs.base_path('watch.js');

        if (app.fs.is_file(file_extender)) {

            require(file_extender);
        }

        const options = {
            ignoreInitial: true,
            ignored: /^vendor.*/
        };

        app.chokidar.watch(app.fs.pwd, options)
            .on('all', (event, path, info) => {
                Object.keys(this.watches).map((key) => {
                    let watches = this.watches[key];
                    let relative_path = path.replace(`${app.fs.pwd}/`, '');
                    if (app.str.is(`${key}`, `${event}${relative_path}`)) {
                        if (Array.isArray(watches)) {
                            watches.map((cb) => {
                                this.run_cb(cb, event, relative_path, info);
                            })
                        } else {
                            this.run_cb(watches, event, relative_path, info);
                        }
                    }
                });
                this.log('[' + event + '] ' + path);
            });

        return 'wait';
    }

    run_cb (cb, event, path, info) {
        if (typeof cb === 'function') {
            cb(path, event, info);
        } else if (typeof cb === 'string') {
            this.signed_exec(
                `Watch event: [${event}][${path}]`,
                cb.replace('{event}', event).replace('{path}', path)
            );
        }
    }

    on_add (path, cb) { app.watch.on(path, cb, 'add') }

    on_change (path, cb) { app.watch.on(path, cb, 'change') }

    on_unlink (path, cb) { app.watch.on(path, cb, 'unlink') }

    on_add_dir (path, cb) { app.watch.on(path, cb, 'addDir') }

    on_unlink_dir (path, cb) { app.watch.on(path, cb, 'unlinkDir') }

    on_error (cb) { app.chokidar.on('error', cb) }

    on_ready (cb) { app.chokidar.on('ready', cb) }

    on (path, cb, events = "*") {
        if (typeof path === 'function') { cb = path; path = "*"; }
        if (typeof cb === 'function' || typeof cb === 'string') {
            events = Array.isArray(events) ? events : [events];
            events.map((event) => {
                path = path === event ? "" : path;
                let key = `${event}${path}`;
                if (!(key in app.watch.watches)) {
                    app.watch.watches[key] = [];
                }
                app.watch.watches[key].push(cb);
            })
        }
    }
}