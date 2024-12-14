#!/usr/bin/env node

/**
 * IMPORTS
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import fs from 'fs';
import { createSpinner } from 'nanospinner';
import { execSync } from 'child_process';
import { Str } from '@supercharge/strings'
    

let directory;
let splitedOutput;
let formatedOutput;


const COMPOSER_FILE_NAME = 'composer.json'
const NODE_FILE_NAME = 'package.json'
const VITE_FILE_NAME = 'vite.config.js'

//console.log(chalk.bgBlackBright(splitedOutput[0]));

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome(){
    const title = chalkAnimation.glitch('REPOVIEWER-CLI');
    await sleep();
    title.stop();

    console.log(`
${chalk.bgCyan('HOW TO USE')}
Select a repo from the list below
REPOVIEWER will automatically open your enviroment  
`)
}

async function askDirectory(){
    const answers = await inquirer.prompt({
        name: 'directory',
        type: 'input',
        message: 'The directory that cointains your repos: [LEAVE IT BLANK IF "home"]',
        default(){
            return directory;
        }
    });

    directory = answers.directory == "" ? "~" : answers.directory;
}

async function repoList(){

    const output = execSync('find '+ directory +' -name ".git" -type d', { encoding: 'utf-8' });  // the default is 'buffer'
    splitedOutput = Str(output).lines();

    formatedOutput = splitedOutput.map(line => line.replace('.git', ''));

    const answers = await inquirer.prompt({
        name:'repo',
        type: 'list',
        message: 'Choose your repo',
        choices: formatedOutput,
    });

    return openRepo(answers.repo);
}

async function openRepo(repo){


    const composerPath = repo + '/' + COMPOSER_FILE_NAME;
    const nodePath = repo + '/' + NODE_FILE_NAME;
    const vitePath = repo + '/' + VITE_FILE_NAME;

    const spinner = createSpinner('Openning repo..... \n').start();
    await sleep();

    if(fs.existsSync(composerPath)){
        await execSync('cd '+ repo +'&& ./vendor/bin/sail up -d',{ stdio: 'inherit' });
        console.log(chalk.bold.black.bgWhite('laravel environment started'));

    }
    
    if(fs.existsSync(nodePath)){
        try {
            await execSync('cd '+ repo +' && sudo npm install',{ stdio: 'inherit' });
            console.log(chalk.white.bgBlack('node modules installed / updated'));
        } catch (error) {
            console.log(chalk.red.bold.bgBlackBright('Error installing node modules'));
        }
    }

    if(fs.existsSync(vitePath)){
        try {
            await execSync('cd '+ repo +' && sudo npm run build',{ stdio: 'inherit' });
            console.log(chalk.white.bgBlack('vite started'));
        } catch (error2) {
            console.log(chalk.red.bold.bgBlackBright('Error starting vite:'));
        }
    }

    spinner.stop();
}

await welcome()
await askDirectory()
await repoList()