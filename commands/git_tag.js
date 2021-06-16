module.exports = class TestCommand extends Command {

    get signature () {

        this.current = false;
        this.publish = false;

        return "git:tag " +
            "{-c|--current? Create tag only for current path} " +
            "{-p|--publish? Run npm publish} " +
            "Git auto tag";
    }

    async handle () {

        let gits = this.current ? ['/'] : app.config.gits_tag;

        for (let i = 0; i < gits.length; i++) {

            let directory = gits[i];
            let dir = app.fs.base_path(directory);
            if (app.fs.is_dir(app.fs.base_path(directory, '.git'))) {

                let out = await this.signed_exec(`GIT: [${dir}] Checking for the need to add a tag...`, `git tag --contains`, dir);

                if (!out.length) {

                    let ans = await this.confirm(`GIT: [${dir}] Create a new tag?`);

                    if (!ans) { continue; }

                    out = await this.signed_exec(`GIT: [${dir}] Get last version...`, `git tag`, dir);
                    let ver = out.length ? app.obj.last(out) : '1.0.0';
                    if (out.length) {
                        this.success(`GIT: [${dir}] Found last version [${ver}]`);
                        ver = ver.split('.');
                        //console.log(app.obj);
                        ver[app.obj.last_key(ver)] =
                            app.num.isNumber(app.obj.last(ver)) ? (Number(app.obj.last(ver))+1) : 0;
                        ver = ver.join('.');
                    } else {
                        this.warn(`GIT: [${dir}] Version not found!`);
                    }

                    ver = await this.ask(`GIT: [${dir}] Enter a next version:`, ver, (d) => {
                        return /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(d);
                    });

                    let message = await this.ask(
                        `GIT: [${dir}] Enter description of the tag:`,
                        `New version ${ver}`
                    );

                    await this.signed_exec(
                        `GIT: [${dir}] Creating a new tag [${ver}][${message}]...`,
                        `git tag -a ${ver} -m '${message}'`,
                        dir
                    );

                    await this.signed_exec(
                        `GIT: [${dir}] Publish a new tag...`,
                        `git push --tag`,
                        dir
                    );

                    if (this.publish) {
                        await this.signed_exec(
                            `GIT: [${dir}] Npm Publish...`,
                            `npm publish`,
                            dir
                        );
                    }

                    this.success(`GIT: [${dir}] Tag [${ver}] created!`);
                }

                else {

                    this.warn(`GIT: [${dir}] The tag already exists [${app.obj.first(out)}]`);
                }
            }
        }

        if (!gits.length) {
            this.warn('GIT: Nothing to create tags from!');
        }
    }
}
