module.exports = class TestCommand extends Command {

    get signature () {

        this.current = false;
        this.publish = false;
        this.tag_name = null;

        return "git:untag {tag_name}" +
            "{-c|--current? Create tag only for current path} " +
            "Git delete tag";
    }

    async handle () {

        let gits = this.current ? ['/'] : app.config.gits_tag;

        for (let i = 0; i < gits.length; i++) {

            let directory = gits[i];
            let dir = app.fs.base_path(directory);
            if (app.fs.is_dir(app.fs.base_path(directory, '.git'))) {

                await this.signed_exec(
                    `GIT: [${dir}] Local drop tag...`,
                    `git tag -d ${this.tag_name}`,
                    dir);

                await this.signed_exec(
                    `GIT: [${dir}] Remote drop tag...`,
                    `git push --delete origin ${this.tag_name}`,
                    dir);
            }

            this.success(`GIT: [${dir}] Finished drop tag...`);
        }

        if (!gits.length) {
            this.warn('GIT: Nothing to remove tags from!');
        }
    }
}
