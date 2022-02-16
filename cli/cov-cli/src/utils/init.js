const boxen = require('boxen')
const sym = require('log-symbols')
const welcome = require('cli-welcome')
const to = require('await-to-js').default
const { yellow, green } = require('chalk')
const checkNode = require('cli-check-node')
const pkgJSON = require('./../../package.json')
const checkForUpdate = require('update-check')
const unhandledError = require('cli-handle-unhandled')

module.exports = async (skipWelcome = false, check = true) => {
	await unhandledError()
	checkNode(`10`)
	!skipWelcome &&
		welcome({
			title: `cov-cli`,
			tagLine: `by toimc.com\n ${pkgJSON.description}`,
			bgColor: `#007C91`,
			color: `#FFFFFF`,
			bold: true,
			clear: true,
			version: `${pkgJSON.version}`
		})

	if (check) {
		const [err, update] = await to(checkForUpdate(pkgJSON))
		if (err) {
			throw new Error(err)
		}
		if (update) {
			console.log(
				boxen(
					`
  ${yellow(`UPDATE AVAILABLE!`)}
  ${sym.info} Run ${green(`npm i -g cov-cli@latest`)} for v${update.latest}
  ${sym.info} https://github.com/toimc/cov-cli\n`,
					{ padding: 1, dimBorder: true, align: `center` }
				)
			)
		}
	}
}
