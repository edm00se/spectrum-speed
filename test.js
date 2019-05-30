import childProcess from 'child_process';
// HOLD import execa from 'execa';
import test from 'ava';

test.cb('default', t => {
	const cp = childProcess.spawn('./cli.js', {stdio: 'inherit'});

	cp.on('error', t.fail);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

/* Hold
test('non-tty', async t => {
	// https://regex101.com/r/LRSxnf/2
	t.regex(await execa.stdout('./cli.js'), /^\d+(?:\.\d+)? \w+ ↓ \/ \d+(?:\.\d+)? \w+ ↑ - \d+(?:\.\d+)? \w+$/i);
});
*/
