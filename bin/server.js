import {ModuleLoader} from "./lib/ModuleLoader.js";
import ApolloModule from "./modules/ApolloModule.js";
import Table from 'cli-table3';
import * as fs from 'fs';
import colors from 'colors';
import git from 'git-rev-sync';
import MongooseModule from "./modules/MongooseModule.js";

colors.enabled = true;

let vobeJson = JSON.parse(fs.readFileSync('vobe.json').toString());

console.log(fs.readFileSync('vobe.txt').toString()
    .replace('%version', vobeJson.version)
    .replace('%commit', git.short(process.cwd()))
    .replace('%node_version', process.version));


let moduleLoader = new ModuleLoader();

moduleLoader.use(new ApolloModule());
moduleLoader.use(new MongooseModule());


console.log('Loading modules... \n' + 'this may take a while'.grey);
const modules = await moduleLoader.run();

let table = new Table({chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}});
modules.forEach(s => table.push([s.message.name, s.success ? 'LOADED'.green : 'ERROR'.red]));
console.log(table.toString());

modules.filter(s => !s.success).forEach(s => console.log(s.error));