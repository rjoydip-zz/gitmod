#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const readPkg = require('read-pkg')

const src = require('../src')

readPkg().then(pkg => {
    program
        .version(pkg.version)

    program
        .command('clone <repo>')
        .option('-c, --clone', 'Clone git repo')
        .action(function (cmd) {        
            src.clone(cmd).then(() => {
                console.log('Cloned successfully')
            })
            .catch((err) => console.error(err))
        })

    program
        .command('uninstall <repo>')
        .option('-u, --uninstall', 'Uninstall module name')
        .action(function (cmd) {        
            src.uninstall(cmd).then(() => {
                console.log(`${cmd} un-installation successfully`)
            })
            .catch((err) => console.error(err))
        })

    program.parse(process.argv)
})  