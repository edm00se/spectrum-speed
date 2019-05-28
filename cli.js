#!/usr/bin/env node
'use strict';
const dns = require('dns');
const meow = require('meow');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const api = require('./api');

meow(`
	Usage
	  $ spectrum
	  $ spectrum > file

	Examples
	  $ spectrum > file && cat file
	  17 Mbps
	  4.4 Mbps
`, {});

// Check connections
dns.lookup('speedtestcustom.com', error => {
	if (error && error.code === 'ENOTFOUND') {
		console.error(chalk.red('\n Please check your internet connection.\n'));
		process.exit(1);
	}
});

let data = {};
const spinner = ora();

const downloadSpeed = () =>
	`${data.downloadSpeed} ${chalk.dim(data.downloadUnit)} ↓`;

const downloadColor = string => ((data.isDone || data.uploadSpeed) ? chalk.green(string) : chalk.cyan(string));

const uploadSpeed = () => `${data.uploadSpeed} ${chalk.dim(data.uploadUnit)} ↑`;

const uploadColor = string => (data.isDone ? chalk.green(string) : chalk.cyan(string));

const pingSpeed = () => `${data.pingSpeed} ${chalk.dim(data.pingUnit)}`;

const pingColor = string => (data.isDone ? chalk.green(string) : chalk.cyan(string));

const speedText = () => `${downloadColor(downloadSpeed())} ${chalk.dim('/')} ${uploadColor(uploadSpeed())} - ${pingColor(pingSpeed())}`;

const speed = () => speedText() + '\n\n';

function exit() {
	if (process.stdout.isTTY) {
		logUpdate(`\n\n    ${speed()}`);
	} else {
		const output = `\n${data.uploadSpeed} ${data.uploadUnit}`;

		console.log(output);
	}

	process.exit();
}

if (process.stdout.isTTY) {
	setInterval(() => {
		const pre = '\n\n  ' + chalk.gray.dim(spinner.frame());

		if (!data.downloadSpeed) {
			logUpdate(pre + '\n\n');
			return;
		}

		logUpdate(pre + speed());
	}, 50);
}

(async () => {
	try {
		await api().forEach(result => {
			data = result;
		});

		exit();
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
})();
