module.exports = class GitPush extends Command {

    get signature() {
        this.tag = false;
        return "git:push " +
            //"{-c|--current? Push only for current path} " +
            // "{-t|--tag? Create tag for current path} " +
            "Git auto push";
    }

    async handle() {

        let gits = app.config.gits;

        for (let i = 0; i < gits.length; i++) {

            let directory = gits[i];
            let dir = app.fs.base_path(directory);
            if (app.fs.is_dir(app.fs.base_path(directory, '.git'))) {

                let out = await this.signed_exec(`GIT: [${dir}] Get status...`, `git status`, dir);

                if (!/.*nothing\sto\scommit.*/.test(out.join(","))) {
                    let comment = null;
                    out = await this.signed_exec(`GIT: [${dir}] Get file list...`, `git diff --name-only`, dir);
                    if (out.length) comment = out.join(", ");
                    else comment = (new Date()).toLocaleString('en-US', { hour12: false });
                    out = await this.signed_exec(`GIT: [${dir}] Get branch...`, `git branch`, dir);
                    let branch = app.obj.get_start_with(out, '*');
                    branch = branch ? branch.replace('*','').trim() : 'master';
                    let answer = await this.prompts({
                        type: 'text',
                        name: 'comment',
                        message: `GIT: [${dir}][${branch}] Commit message?`,
                        initial: comment
                    });
                    comment = answer.comment ? answer.comment : comment;

                    await this.signed_exec(`GIT: [${dir}][${branch}] Add...`, `git add .`, dir);
                    await this.signed_exec(`GIT: [${dir}][${branch}] Commit...`, `git commit -m "${comment}"`, dir);
                    await this.signed_exec(`GIT: [${dir}][${branch}] Push...`, `git push origin ${branch}`, dir);
                    this.success(`GIT: [${dir}][${branch}] Pushed on repository!`);
                }

                else {

                    this.warn(`GIT: [${dir}] Nothing to commit!`);
                }
            }
        }
    }
}
