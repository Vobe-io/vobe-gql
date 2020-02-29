import * as fs from 'fs';
import * as path from 'path';

/**
 *
 * @param path {string, path}
 * @returns {string}
 */
export const stringFromFile = (path) =>
    fs.readFileSync(path, {encoding: 'utf-8'}).toString();

export const getRootPath = (p) => path.join(process.cwd(), p);