module.exports = app.obj.merge_recursive(
    app.fs.get_json_contents(app.fs.path(__dirname, 'bfg.json')),
    app.fs.get_json_contents(app.fs.base_path('bfg.json'))
)