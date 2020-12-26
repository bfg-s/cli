const Fs = require('./core/fs');

module.exports = class ServiceProvider {

    register () {
        this.app.bind('fs', new Fs);
    }
}