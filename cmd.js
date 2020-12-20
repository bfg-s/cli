const colors = require('colors');
colors.enable();

module.exports = {
    modules () {
        let nm = app.fs.base_path('node_modules');
        if (app.fs.is_dir(nm)) {
            let modules = [];
            app.fs.read_dir(nm).map(f => {
                let nmd = app.fs.base_path('node_modules', f, 'cli');
                if (app.fs.is_dir(nmd)) {
                    app.command_dirs.push(nmd);
                }
            });
        }
    },
    inject_files () {
        app.command_dirs.map((path) => {
            if (app.fs.is_dir(path)) {
                app.fs.read_dir(path).map((file) => {
                    if (app.str.end_with(file, '.js')) {
                        let objectClass = require(`${path}/${file}`);
                        try {
                            objectClass = new objectClass();
                        } catch (e) {
                            app.error(e);
                            return ;
                        }
                        objectClass = app.cmd.parse_signature(objectClass);
                        if ('handle' in objectClass && 'name' in objectClass) {
                            app.bind(objectClass.name, objectClass);
                            app.commands.push(objectClass);
                        }
                    }
                });
            }
        });
    },
    parse_signature (obj) {
        if ('signature' in obj && obj.signature && /^([a-zA-Z0-9\_\-\:]{1,})\s(\{.*\})?\s?(.*)$/.test(obj.signature)) {
            let signature = /^([a-zA-Z0-9\_\-\:]{1,})\s(\{.*\})?\s?(.*)$/.exec(obj.signature);
            if (!obj.name) obj.name = signature[1];
            if (!obj.params) obj.params = signature[2];
            if (!obj.description) obj.description = signature[3];
        }
        return obj;
    },
    parse_params (command) {
        const args = app.args;
        if ('params' in command && command.params) {
            command.params = String(command.params)
                .replace(/\}\{/g, '} {')
                .split(/}\s{/)
                .map((param) => {
                    param = `{${app.str.trim(param.trim(), '{}')}}`;
                    if (/^\{([a-zA-Z0-9\_\|]+)(\?|)\s?(.*)\}$/.test(param)) {
                        let pars = /^\{([a-zA-Z0-9\_\|]+)(\?|)\s?(.*)\}$/.exec(param);
                        return {
                            arg: true,
                            name: pars[1],
                            required: pars[2] !== '?',
                            description: pars[3]
                        }
                    } else if (/^\{[\-]{1,2}([a-zA-Z0-9\_\|\-]+)\s*(\=|)\s*(\?|)?\s*(.*)\}$/.test(param)) {
                        let pars = /^\{[\-]{1,2}([a-zA-Z0-9\_\|\-]+)\s*(\=|)\s*(\?|)?\s*(.*)\}$/.exec(param);
                        let name = null;
                        let names = !!pars[1] ? pars[1].split('|').filter((i) => {
                            if (/^\-\-.*/.test(i)) {
                                name = i.replace(/\-/g, '').trim();
                                return false;
                            }
                            return true;
                        }).map((i, k) => {
                            return i.replace(/\-/g, '').trim();
                        }) : [null];
                        if (!name) {
                            name = names[0];
                            delete names[0];
                        }
                        return {
                            arg: false,
                            value: pars[2] === '=',
                            name: name,
                            aliases: names.join('[==--==]').split('[==--==]'),
                            required: pars[3] !== '?',
                            description: pars[4]
                        }
                    }
                    return false;
                });
            command.params = command.params.filter((i) => i !== false);
        }

        command.help = !!('h' in args.options || 'help' in args.options);
        command.quiet = !!('q' in args.options || 'quiet' in args.options);
        command.version = !!('v' in args.props || 'version' in args.props);
        command.verbose = !command.version ? (
            'v' in args.options ? 1 : (
                'vv' in args.options ? 2 : (
                    'vvv' in args.options ? 3 : (
                        'verbose' in args.options ? 3 : 0
                    )
                )
            )
        ) : 0;
        return command;
    },
    validate_object_params (command) {
        const args = app.args;
        if ('params' in command && command.params !== undefined) {
            let last_arg_index = 0;
            command.params.map((param) => {
                if (param.arg) {
                    if (!(last_arg_index in args.arguments)) {
                        if (param.required) {
                            app.die(`The parameter "${param.name}" was not found.`);
                        }
                    } else {
                        command[param.name] = args.arguments[last_arg_index];
                    }
                    last_arg_index++;
                } else {
                    let val = param.value ? undefined : (param.name in command ? command[param.name] : null);
                    let finded = false;
                    if (param.name in args.options) {
                        finded = true;
                        val = args.options[param.name];
                    }
                    else {
                        param.aliases.map((n) => {
                            if (n in args.options && !finded) {
                                if (param.value) {
                                    if (args.options[n] !== null) {
                                        finded = true;
                                        val = args.options[n];
                                    }
                                } else {
                                    finded = true;
                                    val = args.options[n] === null;
                                }
                            }
                        });
                    }
                    if (!finded && param.required) {
                        app.die(`The option "${param.name}" was not found.`);
                    } else if (!finded && param.value && param.required) {
                        app.die(`You need to provide a value for the "${param.name}" option.`);
                    } else {
                        if (val !== undefined) command[param.name] = val;
                    }
                }
            });
        }
        return command;
    },
    async call (name = null, params) {
        let personal = !!name;
        name = personal ? name : app.args.name;
        if (app.has(name)) {
            let command = app.get(name);
            command = app.cmd.parse_params(command);
            if (!personal && command.help && 'show_help' in command) {
                command.show_help();
                app.die(null, 0);
            }
            if (!personal && command.version && 'show_version' in command) {
                command.show_version();
                app.die(null, 0);
            }
            command = app.cmd.validate_object_params(command);
            if ('handle' in command) {
                if (personal && typeof params === 'object') {
                    Object.keys(params).map(k => {
                        if (!app.num.isNumber(k)) command[k] = params[k];
                    });
                }
                let code = await command.handle();
                if (!personal && code !== 'wait') app.die(null, code || 0);
            }
        } else {
            if (!personal) app.die(`Command [${name}] not found!`, 404);
            else app.error(`Command [${name}] not found!`);
        }
    }
};