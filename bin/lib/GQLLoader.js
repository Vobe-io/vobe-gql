import * as fs from 'fs';
import * as path from 'path';
import * as vobeUtil from "../vobe-util.js";
import merge from 'deepmerge';


export default class GQLLoader {

    resolver = {};
    directives = {};
    typeDefs = '';

    loadResolver = async (dir) => {
        this._testDir(dir);

        let files = await this._loadFiles(dir);
        files.forEach(r => this.resolver = merge(this.resolver, r));

        return this.resolver;
    };

    loadDirectives = async (dir) => {
        this._testDir(dir);

        let files = await this._loadFiles(dir);
        files.forEach(r => {
            let directive = {};
            Object.keys(r.directives).forEach(k => directive = merge(directive, r.directives[k]));
            this.directives = merge(this.directives, directive)
        });

        return this.directives;
    };

    loadTypes = async (dir) => {
        this._testDir(dir);

        this.typeDefs = vobeUtil.walk(dir).map(f => fs.readFileSync(f['path'], 'utf-8')).join('\n');
        return this.typeDefs;
    };


    _getJsFiles = (_) => fs.readdirSync(_, {withFileTypes: true})
        .map(f => f.isDirectory() ? this._getJsFiles(path.join(_, f.name)) : {
            path: path.join(_, f.name),
            itemName: f.name,
            name: f.name.replace(/[.].*$/gim, ''),
            dir: _.replace(/(.*[\\/])/gim, '')
        }).flat();

    _loadFiles = async (dir) => await Promise.all(this._getJsFiles(dir)
        .map(async file => ({[file.dir]: {[file.name]: (await import(file['path'])).default}})));

    _testDir = (dir) => {
        if (dir === undefined)
            throw new Error("Folder path not defined -> " + dir);
        if (!fs.existsSync(dir))
            throw new Error(`Folder ${dir} path does not exist`);
    }

}