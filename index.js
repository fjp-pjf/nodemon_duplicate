#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program 
    .version('0.0.1')
    .argument('[filename]', 'Name of the file to be executed!')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try{
            await fs.promises.access(name);
        }catch (err) {
            throw new Error(`Couldnot find the file ${name}`);
        }

        let proc;

        const startUserCode = debounce(() =>{
            if(proc){
                proc.kill();
            }
            console.log(chalk.green('>>>>>>Starting process :)'));
            proc = spawn('node', [name], {stdio: 'inherit'});
        }, 100);

        chokidar
                .watch('.')
                .on('add',startUserCode)//""
                .on('change', startUserCode)//whenever anything new start again.
                .on('unlink', startUserCode);//""
    });
program.parse(process.argv);

