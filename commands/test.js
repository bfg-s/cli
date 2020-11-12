module.exports = class TestCommand extends Command {

    get signature () {

        return "test A test command";
    }

    handle () {

        console.log(app.fs.is_dir(app.fs.path('.env')));
    }
}