import chalk from 'chalk';
import ncp from 'ncp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

// Convert to fs.access to Async Function | Assign to access variable
const access = promisify(fs.access);

// Convert to ncp to Async Function | Assign to copy variable
const copy = promisify(ncp);

// Asynchronous File-Copy function
async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

// Asynchronous Git Initialization function
async function initGit(options) {
    const result = await execa("git", ["init"], {
        cwd: options.targetDirectory
    });

    if  (result.failed) {
        return Promise.reject(new Error("%s Could not initialize as git repository", chalk.red.bold("FAIL -")))
    }

    return
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    }

    const currentFileURL = import.meta.url;

