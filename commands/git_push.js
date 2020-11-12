module.exports = class GitPush extends Command {

    get signature() {
        return "git:push Git auto push";
    }

    async handle() {

        let gits = app.config.gits;
        let dirs = [];
        let choices = [];

        for (let i = 0; i < gits.length; i++) {
            let directory = gits[i];
            let dir = app.help.base_path(directory);
            if (this.is_file(app.help.base_path(directory, '.git'))) {

                let out = [];

                await this.exec(`cd ${dir} && git status`, out);
                let status = app.obj.last(out);
                console.log(Array(status[0]).join(","));
                if (Array(status[0]).join(",") !== 'On branch master,nothing to commit, working tree clean') {

                    let out = [];
                    await this.exec(`cd ${dir} && git diff --name-only`, out);
                    let last = app.obj.last(out);
                    if (Array.isArray(last) && last.length) {
                        dirs.push({
                            dir, "path": directory, "files": last
                        });
                        choices.push({title: dir, value: dirs.length - 1});
                    } else {
                        dirs.push({
                            dir, "path": directory, "files": ['new']
                        });
                        choices.push({title: dir, value: dirs.length - 1});
                    }
                } else {

                    choices.push({title: dir, value: dirs.length, disabled: true, description: 'No changes'});
                }
            } else {
                this.comment(`GIT: The folder [${dir}] is ignored because an initialized git is missing.`);
            }
        }

        let selected = [];

        if (gits.length > 1) {

            let answers = await this.prompts({
                type: 'multiselect',
                name: 'selected',
                message: 'GIT: Choose folders for pushing.',
                choices: choices,
                hint: '- Space to select. Return to submit',
                instructions: !!this.verbose
            });
            if (answers.selected) {

                answers.selected.map(an => selected.push(an));
            }

        } else if (choices.length) {

            selected.push(app.obj.first(choices).value);
        }

        if (!selected.length) {

            this.exit('GIT: There is nothing to push.');
        }

        selected = selected.map(i => dirs[i]);

        for (let i = 0; i < selected.length; i++) {
            let select = selected[i], out_branch = [], branch = null;
            await this.exec(`cd ${select.dir} && git branch`, out_branch);
            if (0 in out_branch) {
                out_branch[0].map((b) => {
                    if (!branch) {
                        let exec = /^\*\s([^\(][a-zA-Z0-9\_\-\:\.]+[^\)])$/.exec(b);
                        if (exec) branch = exec[1];
                    }
                });
            } else {
                branch = 'master';
            }
            let l = null;
            let ask_comment = await this.prompts({
                type: 'text',
                name: 'val',
                message: `GIT: [${select.dir}] Commit message?`,
                initial: select.files.join(', ')
            });
            l = this.process({}).start(`GIT: [${select.dir}] Add...`);
            await this.exec(`cd ${select.dir} && git add .`);
            l.succeed();
            l = this.process(`GIT: [${select.dir}] Commit...`).start();
            await this.exec(`cd ${select.dir} && git commit -m "${ask_comment.val}"`);
            l.succeed();
            l = this.process(`GIT: [${select.dir}] Push...`).start();
            await this.exec(`cd ${select.dir} && git push origin ${branch}`);
            l.succeed();
            l = this.process(`GIT: [${select.dir}] Pushed on repository!`).start();
            l.succeed();
        }
    }
}