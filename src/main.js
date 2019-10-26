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

    // Define template directory
    const templateDir = path.resolve(
        new URL(currentFileURL).pathname.substring(new URL(currentFileURL).pathname.indexOf("/")+1),
        "../../templates",
        options.template
    );

    // Set template directory
    options.templateDirectory = templateDir;

    // Validate direcotry
    try {
        await access(templateDir, fs.constants.R_OK)
    }
    catch (error) {
        console.error("%s Invalid template name", chalk.red.bold("ERROR -"));
        process.exit(1)
    }

    // Define lazy-boi execution process | Dependant on arguments
    const task = new Listr([
        {
            title: "Now copying files...",
            task: () => copyTemplateFiles(options)
        },
        {
            title: "Initializing git...",
            task: () => initGit(options),
            enabled: () => options.git
        },
        {
            title: "Installing dependencies...",
            task: () => projectInstall({ cwd: options.targetDirectory }),
            skip: () => !options.runInstall
                ? "Pass --install to automatically install all required template dependencies"
                : undefined
        }
    ]);

    // Execute
    try {
        await task.run()
    }
    catch (error) {
        console.log(error)
    }

