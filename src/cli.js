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

    /* Additional options accepted by CLI */
    // Template options accepted as arguments
    if (!options.template) {
        questions.push(
            {
                type: "list",
                name: "template",
                message: "Please choose a project template:",
                choices: ["JavaScript", "ReactJS", "VueJS"],
                default: defaultTemplate
            }
        )
    }
    else {
        console.log("%s Invalid argument value", chalk.red.bold("ERROR -")),
        process.exit(1)
    }

    // Initialize as Git Repository
    if (!options.git) {
        questions.push(
            {
                type: "confirm",
                name: "git",
                message: "Initialize as git repository?",
                default: false
            }
        )
    }

