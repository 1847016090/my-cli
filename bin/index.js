#!/usr/bin/env node
const commander = require('commander');
const init = require('../lib/init.js')
commander.version(require('../package.json').version);

commander.command('init <name>')
.alias('i <name>')
.description('init project')
.action(async(name) => {
    await init(name)
})

commander.parse(process.argv);