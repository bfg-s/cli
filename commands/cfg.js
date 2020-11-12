module.exports = class TestCommand extends Command {

    get signature () {

        return "cfg Show a Bfg configs";
    }

    handle () {

        let rows = [];

        Object.keys(app.config).map((key) => {
            let val = app.config[key];
            rows.push([key.green, app.obj.isArrayOrObject(val) ? JSON.stringify(val) : val]);
        });

        this.table(rows, {head: ['Key', 'Value']});
    }
}