const wait = "__CLI_WAIT__";

module.exports = class ArgsParse {

    constructor() {

        let args = [];
        this.name = 'default';
        this.options = [];
        this.arguments = [];

        process.argv.map((val, i) => {
            if ( i > 2 ) {
                args.push(val);
            } else if ( i === 2) {
                this.name = val;
            }
        });

        args.forEach((arg) => {

            let p = /^\-\-([^\=\s]*){1}$/.exec(arg);

            if (Array.isArray(p) && 1 in p) {
                this.options[p[1]] = wait; //this.checkValue(p[2]);
            } else if (/^\-([a-zA-Z0-9]{1,3}){1}$/.test(arg)) {
                let o = /^\-([a-zA-Z0-9]{1,3}){1}$/.exec(arg);
                this.options[o[1]] = wait;
            } else {
                if (app.obj.last(this.options) === wait) {
                    this.options[app.obj.last_key(this.options)] = this.checkValue(arg);
                } else {
                    this.arguments.push(this.checkValue(arg));
                }
            }
        });

        Object.keys(this.options).map((key) => {
            if (this.options[key] === wait) {
                this.options[key] = null;
            }
        });
    }

    checkValue (val) {
        if (val === 'true') {
            val = true;
        } else if (val === 'false') {
            val = false;
        } else if (val === 'null' || val === '') {
            val = null;
        } else if (val === 'undefined') {
            val = undefined;
        }
        return val;
    }
}