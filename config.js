const fs = require('fs');

module.exports = (app, default_configs) => {

    let config_file = app.help.base_path('./bfg.json');

    let json = {};

    if (fs.existsSync(config_file)) {

        try {
            json = JSON.parse(fs.readFileSync(config_file).toString());
        } catch (e) {}
    }

    return app.obj.merge_recursive(default_configs, json);
};