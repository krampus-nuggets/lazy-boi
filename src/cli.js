import arg from "arg";
import inquirer from "inquirer";
import chalk from 'chalk';
import { createProject } from "./main";

// Process CLI arguments
function parseArgToOpt(rawArgs) {
    const args = arg(
        {
            "--git": Boolean,
            "--yes": Boolean,
            "--install": Boolean,
            "-g": "--git",
            "-y": "--yes",
            "-i": "--install"
        },
        {
            argv: rawArgs.splice(2)
        }
    );
    return {
        skipPrompts: args["--yes"] || false,
        git: args["--git"] || false,
        template: args._[0],
        runInstall: args["--install"] || false
    }
}

// Process missing options | if - lazy-boi is executed without arguments
async function promtMissOpt(options) {
    const defaultTemplate = "JavaScript";

    // Apply default options
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate
        }
    }

    // Store values in array | Templates & Git below
    const questions = [];

