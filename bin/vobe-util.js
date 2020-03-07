import * as fs from 'fs';
import * as path from 'path';


/**
 *
 * @param path {string}
 * @returns {string}
 */
export const stringFromFile = (path) =>
    fs.readFileSync(path, 'urf-8').toString();


/**
 * Lets you list every file in a specific directory. Including sub folders.
 * @param dir {string} Path to dir
 * @returns {string[]} Paths to files
 */
export const walk = (dir) => fs.readdirSync(dir, {withFileTypes: true})
    .map(f => f.isDirectory() ? walk(path.join(dir, f.name)) : {
        path: path.join(dir, f.name),
        name: f.name
    }).flat();