module.exports = class GitPush extends Command {

    get signature() {
        return "git:pull " +
            "Git auto pull";
    }

    async handle() {

        let gits = app.config.gits;

        for (let i = 0; i < gits.length; i++) {

            let directory = gits[i];
            let dir = app.fs.base_path(directory);
            if (app.fs.is_dir(app.fs.base_path(directory, '.git'))) {

                let out = await this.signed_exec(`GIT: [${dir}] Get branch...`, `git branch`, dir);
                let branch = app.obj.get_start_with(out, '*');
                branch = branch ? branch.replace('*','').trim() : 'master';
                await this.signed_exec(`GIT: [${dir}][${branch}] Pulling...`, `git push origin ${branch}`, dir);
                this.success(`GIT: [${dir}][${branch}] Pulled from repository!`);
            }
        }
    }
}
