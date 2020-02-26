import Status from "./Status.js";

export class ModuleLoader {

    modules = [];

    use(m) {
        if (m instanceof Module) {
            this.modules.push(m);
        }
    }

    async run() {
        let modules = [];
        for (let m of this.modules.sort((a, b) => a.index - b.index)) {
            try {
                await m.load();
                modules.push(new Status(true, m));
            } catch (e) {
                let status = new Status(false, m);
                status.error = e;
                modules.push(status);
            }
        }
        return modules;
    }

}

export class Module {

    name = '[UNNAMED MODULE]';
    index = 0;

    async load() {
    };

}