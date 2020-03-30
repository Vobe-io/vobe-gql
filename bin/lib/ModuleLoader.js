import Status from "./Status.js";

export class ModuleLoader {

    modules = [];

    use(m) {
        if (m instanceof Module)
            this.modules.push(m);
        if (typeof m === 'string') {
            console.log(import(m));
        }
    }

    async run() {
        let modules = [];
        for (let m of this.modules.sort((a, b) => a.index - b.index)) {
            try {
                let status = await m.load();
                status.message = m;
                modules.push(status);
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