const meow = require('meow')
const { green, yellow, cyan } = require('chalk')

module.exports = meow(
	`
	Usage
	  ${green(`cov-cli`)} ${cyan(`<command>`)} ${yellow(`[--option]`)}
	Commands
	  ${cyan(`country-name`)}  Get data for a given country
	  ${cyan(`local`)}         Get data for all Chinese province
	Options
	  ${yellow(`-a`)}, ${yellow(`--avaliable`)} Show Avaliable Countries' Name
	  ${yellow(`-p`)}, ${yellow(`--pattern`)}   Searcg Pattern for Countries' Name
	  ${yellow(`-s`)}, ${yellow(`--sort`)}      Sort data by type
	  ${yellow(`-r`)}, ${yellow(`--reverse`)}   Reverse print order
	  ${yellow(`-l`)}, ${yellow(`--limit`)}     Print only N entries
	  ${yellow(`-y`)}, ${yellow(`--language`)}  Choose the language to Print
	  ${yellow(`-m`)}, ${yellow(`--minimal`)}   Minimal output
	  ${yellow(`-c`)}, ${yellow(`--check`)}     Check Updates, default true
	Examples
	  ${green(`cov-cli`)} ${cyan(`中国`)}
	  ${green(`cov-cli`)} ${cyan(`local`)}
	  ${green(`cov-cli`)} ${yellow(`-a`)}
	  ${green(`cov-cli`)} ${yellow(`--sort`)} ${cyan(
		`country / cases(default) / deaths / recovered / active / suspected`
	)}
	  ${green(`cov-cli`)} ${yellow(`-s`)} ${cyan(`critical`)}
	❯ You can also run command + option at once:
	  ${green(`cov-cli`)} ${cyan(`-a`)} ${yellow(`-l 10`)} ${yellow(
		`-y en`
	)} ${yellow(`-p Ch`)}
`,
	{
		booleanDefault: undefined,
		hardRejection: false,
		inferType: false,
		flags: {
			avaliable: {
				type: 'boolean',
				default: false,
				alias: 'a'
			},
			language: {
				type: 'string',
				default: 'zh',
				alias: 'y'
			},
			sort: {
				type: 'string',
				default: 'cases',
				alias: 's'
			},
			reverse: {
				type: 'boolean',
				default: false,
				alias: 'r'
			},
			check: {
				type: 'boolean',
				default: true,
				alias: 'c'
			},
			pattern: {
				type: 'string',
				default: '',
				alias: 'p'
			},
			limit: {
				type: 'number',
				default: Number.MAX_SAFE_INTEGER,
				alias: 'l'
			},
			minimal: {
				type: 'boolean',
				default: false,
				alias: 'm'
			}
		}
	}
)
