#!/usr/bin/env node

/**
 * IMPORTS
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { execSync } from 'child_process';
import { Str } from '@supercharge/strings'
    

let directory;

const output = execSync('find ~ -name ".git" -type d', { encoding: 'utf-8' });  // the default is 'buffer'
var splitedOutput = Str(output).lines(); 
//console.log(chalk.bgBlackBright(splitedOutput[0]));

const sleep = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

async function welcome(){
    const title = chalkAnimation.neon('REPOVIEW-CLI');


    await sleep();
    title.stop();

    console.log(`
${chalk.bgCyan('HOW TO USE')}
Select a repo from the list bellow
REPOVIWER will automatically open your enviroment  
`)
}

async function askDirectory(){
    const answers = await inquirer.prompt({
        name: 'directory',
        type: 'input',
        message: 'The directory that cointains your repos: [LEAVE BLANK IF "HOME"]',
        default(){
            return directory;
        }
    });

    directory = answers.directory == "" ? "~" : answers.directory;
}

async function repoList(){
    const answers = await inquirer.prompt({
        name:'repo',
        type: 'list',
        message: 'Choose your repo',
        choices: splitedOutput,

    });

    return openRepo(answers.repo);
}

async function openRepo(){
    const spinner = createSpinner('Openning repo.....').start();
    await sleep();
}

await welcome()
await askDirectory()
await repoList()