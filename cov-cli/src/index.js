#!/usr/bin/env node

const cli = require('./utils/cli.js')
const init = require('./utils/init.js')
const ora = require('ora')
const getAvaliable = require('./api/getAvaliable')
const getArea = require('./api/getArea')

// Cli.
const [input] = cli.input
const sortBy = cli.flags.sort
const reverse = cli.flags.reverse
const limit = Math.abs(cli.flags.limit)
const avaliable = cli.flags.avaliable
const lang = cli.flags.language
const minimal = cli.flags.minimal
const pattern = cli.flags.pattern
const check = cli.flags.check
const options = { avaliable, lang, sortBy, limit, reverse, minimal }

const run = async () => {
	// Init.
	await init(minimal, check)

	const spinner = ora({ text: 'loading...' })
	input === 'help' && (await cli.showHelp(0))
	spinner.start()
	if (avaliable) {
		await getAvaliable({ spinner, limit, lang, search: pattern })
	} else {
		await getArea({
			spinner: spinner,
			...options,
			province: input ? input : null
		})
	}
}

run()
