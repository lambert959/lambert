const axios = require('axios')
// const { cyan, dim } = require('chalk')
const to = require('await-to-js').default
const handleError = require('cli-handle-error')

module.exports = async ({ spinner, limit, search, lang }) => {
	let allCountries
	const [err, response] = await to(
		axios.get(`https://lab.isaaclin.cn/nCoV/api/provinceName?lang=${lang}`)
	)
	allCountries = response.data.results
	handleError('API Request Error', err, false)

	if (search) {
		console.log('search', search)
		allCountries = allCountries.filter(i => new RegExp(search, 'g').test(i))
	}
	allCountries = allCountries.slice(0, limit)
	spinner.stopAndPersist()
	console.log('all avaliable City & Countries:\n', allCountries)
}
