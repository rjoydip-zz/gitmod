#!/usr/bin/env node
'use strict'
const ora = require('ora')
const chalk = require('chalk')
const shell = require('shelljs')
const program = require('commander')
const pkg = require('./package.json')

const TYPE = ['https', 'ssh']
const spinnerType = {
	'interval': 80,
	'frames': [
		'⣾',
		'⣽',
		'⣻',
		'⢿',
		'⡿',
		'⣟',
		'⣯',
		'⣷'
	]
}

const install = async (repo, type) => {
	const spinner = ora({
		text: `[${chalk.blue(pkg.name)}] installing ${chalk.green(repo)}`,
		spinner: spinnerType,
	})
	try {
		spinner.start()
		const _type = TYPE.includes(type) ? type : TYPE[0]
		await shell.exec(`npm install git+${_type}://git@github.com/${repo}.git`, {async:true} , (code, stdout, stderr) => {
			if(stderr) {
				spinner.fail(stderr)
			} else {
				spinner.succeed(stdout)
			}
		})
	} catch (err) {
		spinner.fail(err)
	}
}

const uninstall = async (repo) => {
	const spinner = ora({
		text: `[${chalk.blue(pkg.name)}] uninstalling ${chalk.green(repo)}\n`,
		spinner: spinnerType,
	})
	try {
		spinner.start()
		await shell.exec(`npm uninstall ${repo}`, {async:true} , (code, stdout, stderr) => {
			if(stderr) {
				spinner.fail(`${stderr}`)
			} else {
				spinner.succeed(`${stdout}`)
			}
		})
	} catch (err) {
		spinner.fail(`${err}`)
	}
};

// eslint-disable-next-line
(async () => {
	program.version(pkg.version, '-v, --version')

	program
		.command('install <repo> [type]')
		.option('-i, --install', 'Install github repository')
		.action(async (cmd, type) => {
			await install(cmd, type)
		})

	program
		.command('uninstall <repo>')
		.option('-u, --uninstall', 'Uninstall module')
		.action(async cmd => {
			await uninstall(cmd)
		})

	program
		.command('remove <repo>')
		.option('-r, --remove', 'Remove module')
		.action(async cmd => {
			await uninstall(cmd)
		})

	program.parse(process.argv)
})()
