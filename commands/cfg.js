module.exports = class TestCommand extends Command {

    get signature () {

        return "cfg Show a Bfg config viewer";
    }

    handle () {

        let rows = [];

        Object.keys(app.config).map((key) => {
            let val = app.config[key];
            rows.push([
                key.green, app.obj.isArrayOrObject(val) ?
                    this.make_table(val) : val
            ]);
        });

        this.table(rows, {head: ['Key', 'Value']});
    }

    make_table (obj) {
        let tbl = this.tbl();
        Object.keys(obj).map((key) => {
            let val = obj[key];
            tbl.push([
                key.green, app.obj.isArrayOrObject(val) ?
                    this.make_table(val) : val
            ]);
        });
        return tbl.toString();
    }

    show_version() {
        super.show_version();

        this.line("Config viewer", "v1.0.0".green);
    }
}