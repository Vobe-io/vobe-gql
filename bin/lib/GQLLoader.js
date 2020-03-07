import * as fs from 'fs';
import * as path from 'path';
import * as vobeUtil from "../vobe-util.js";
import merge from 'deepmerge';


export default class GQLLoader {

    resolver = {};
    typeDefs = '';

    loadResolver = async (dir) => {
        this._testDir(dir);

        const walk = (_) => fs.readdirSync(_, {withFileTypes: true})
            .map(f => f.isDirectory() ? walk(path.join(_, f.name)) : {
                path: path.join(_, f.name),
                name: f.name.replace(/[.].*$/gim, ''),
                dir: _.replace(/(.*[\\/])/gim, '')
            }).flat();

        /**
         * Imports given paths from walk(..) and assigns them to the resolver object
         */
        await Promise.all(walk(dir)
            .map(async file => ({[file.dir]: {[file.name]: (await import(file['path'])).default}})))
            .then(m => m.forEach(r => this.resolver = merge(this.resolver, r)));

        return this.resolver;
    };

    loadTypes = async (dir) => {
        this._testDir(dir);

        this.typeDefs = vobeUtil.walk(dir).map(f => fs.readFileSync(f['path'], 'utf-8')).join('\n');
        return this.typeDefs;
    };

    _testDir(dir) {
        /**
         * Test if {dir} is path nad exists
         */
        if (dir === undefined)
            throw new Error("Folder path not defined -> " + dir);
        if (!fs.existsSync(dir))
            throw new Error(`Folder ${dir} path does not exist`);
    }

}