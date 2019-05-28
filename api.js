'use strict';
/* eslint-env browser */
const puppeteer = require('puppeteer');
const Observable = require('zen-observable');
const equals = require('deep-equal');
const delay = require('delay');

async function prepare(browser, page) {
	/* eslint-disable no-constant-condition, no-await-in-loop */
	while (true) {
		const result = await page.evaluate(() => {
			const $ = document.querySelector.bind(document);
			const btn = $('button[aria-label^=start]');
			const btnVis = btn !== null;
			const hasSelectedServer = $('.host-list-single') ?
				$('.host-list-single')
					.textContent.trim()
					.toLowerCase() !== 'finding optimal server...' :
				true;
			const isDone = [...$('.test').classList].includes('test--in-progress');
			if (hasSelectedServer === true && isDone !== true && btnVis === true) {
				btn.click();
			}

			return {
				isDone,
				hasSelectedServer
			};
		});
		if (result.isDone && result.hasSelectedServer) {
			return;
		}

		await delay(100);
	}
}

async function init(browser, page, observer, options) {
	let prevResult;

	while (true) {
		const result = await page.evaluate(() => {
			const $ = document.querySelector.bind(document);

			return {
				downloadSpeed: Number($('.result-tile-download .number').textContent),
				uploadSpeed: Number($('.result-tile-upload .number').textContent),
				pingSpeed: Number($('.results-latency .number').textContent),
				downloadUnit: $('.result-tile-download .unit').textContent.trim(),
				uploadUnit: $('.result-tile-upload .unit').textContent.trim(),
				pingUnit: $('.results-latency .unit').textContent.trim(),
				isDone: Boolean(
					$('.test') && [...$('.test').classList].includes('test--finished')
				)
			};
		});

		if (result.downloadSpeed > 0 && !equals(result, prevResult)) {
			observer.next(result);
		}

		if (result.isDone || (options && result.uploadSpeed)) {
			browser.close();
			observer.complete();
			return;
		}

		prevResult = result;

		await delay(100);
	}
	/* eslint-enable no-constant-condition, no-await-in-loop */
}

module.exports = options =>
	new Observable(observer => {
		// Wrapped in async IIFE as `new Observable` can't handle async function
		(async () => {
			const browser = await puppeteer.launch({args: ['--no-sandbox']});
			const page = await browser.newPage();
			await page.goto('https://charter.speedtestcustom.com');
			await prepare(browser, page, observer, options);
			await init(browser, page, observer, options);
		})().catch(observer.error.bind(observer));
	});
