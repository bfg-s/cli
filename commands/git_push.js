module.exports = class GitPush extends Command {

    get signature() {
        return "git:push {-c|--current? Push only for current path} Git auto push";
    }

    async handle() {

        let gits = app.config.gits;

        for (let i = 0; i < gits.length; i++) {

            let directory = gits[i];
            let dir = app.fs.base_path(directory);
            if (app.fs.is_dir(app.fs.base_path(directory, '.git'))) {

                let out = await this.signed_exec(`GIT: [${dir}] Get status...`, `cd ${dir} && git status`);

                if (out.join(",") !== 'On branch master,nothing to commit, working tree clean') {
                    let comment = null;
                    out = await this.signed_exec(`GIT: [${dir}] Get file list...`, `cd ${dir} && git diff --name-only`);
                    if (out.length) comment = out.join(", ");
                    else comment = (new Date()).toLocaleString('en-US', { hour12: false });
                    out = await this.signed_exec(`GIT: [${dir}] Get branch...`, `cd ${dir} && git branch`);
                    let branch = app.obj.get_start_with(out, '*');
                    branch = branch ? branch.replace('*','').trim() : 'master';
                    let answer = await this.prompts({
                        type: 'text',
                        name: 'comment',
                        message: `GIT: [${dir}] Commit message?`,
                        initial: comment
                    });
                    comment = answer.comment ? answer.comment : comment;

                    await this.signed_exec(`GIT: [${dir}] Add...`, `cd ${dir} && git add .`);
                    await this.signed_exec(`GIT: [${dir}] Commit...`, `cd ${dir} && git commit -m "${comment}"`);
                    await this.signed_exec(`GIT: [${dir}] Push...`, `cd ${dir} && git push origin ${branch}`);
                    this.success(`GIT: [${dir}] Pushed on repository!`);
                }

                else {

                    this.warn(`GIT: [${dir}] Nothing to commit!`);
                }
            }
        }
    }
}