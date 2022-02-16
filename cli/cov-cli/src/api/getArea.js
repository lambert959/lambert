const axios = require('axios')
const { red } = require('chalk')
const to = require('await-to-js').default
const handleError = require('cli-handle-error')
const orderBy = require('lodash.orderby')
const { sortingKeys, single } = require('../utils/table.js')
const Table = require('cli-table3')
const { style, local, colored, borderless } = require('../utils/table.js')

module.exports = async ({
	spinner,
	limit,
	lang,
	province,
	minimal,
	reverse,
	sortBy
}) => {
	const border = minimal ? borderless : {}

	let url = 'https://lab.isaaclin.cn/nCoV/api/area?latest=1'
	if (lang && province && province != 'local') {
		if (lang == 'zh') {
			url += `&province=${encodeURI(province)}`
		} else {
			url += `&provinceEng=${province}`
		}
	}
	let data
	const [err, response] = await to(
		axios({ url: url, method: 'get', timeout: 10000 })
	)
	data = response.data.results
	handleError('API Request Error', err, false)

	if (!province) {
		data = data.filter(i => i.countryName == i.provinceName)
	} else if (province == 'local') {
		data = data.filter(i => i.countryName == '中国')
	}

	data = data.slice(0, limit)

	const direction = reverse ? 'asc' : 'desc'
	data = orderBy(data, [sortingKeys[sortBy]], [direction])

	var head = colored
	if (province == 'local') {
		head = local
	} else if (province) {
		head = single
	}
	var output = new Table({ head, style, chars: border })

	data.map((item, count) => {
		if (item.countryName == '中国' && data.length > 1) {
			if (province == 'local') {
				output.push([
					count + 1,
					item.provinceName,
					item.confirmedCount,
					item.deadCount,
					item.suspectedCount,
					item.curedCount,
					item.currentConfirmedCount
				])
			} else {
				output.push([
					`${red(count + 1)}`,
					`${red(item.countryName)}`,
					`${red(item.confirmedCount)}`,
					`${red(item.deadCount)}`,
					`${red(item.suspectedCount)}`,
					`${red(item.curedCount)}`,
					`${red(item.currentConfirmedCount)}`
				])
			}
		} else if (item.countryName != item.provinceName && province) {
			output = new Table({ head: single, style, chars: border })
			output.push([
				'总数据',
				item.provinceName,
				item.confirmedCount,
				item.deadCount,
				item.suspectedCount,
				item.curedCount,
				item.currentConfirmedCount
			])

			if (item.cities.length > 0) {
				var cities = item.cities
				cities = orderBy(cities, [sortingKeys[sortBy]], [direction])
				cities.map((element, ncount) => {
					output.push([
						ncount + 1,
						element.cityName,
						element.confirmedCount,
						element.deadCount,
						element.suspectedCount,
						element.curedCount,
						element.currentConfirmedCount
					])
				})
			}
		} else {
			output.push([
				count + 1,
				item.countryName,
				item.confirmedCount,
				item.deadCount,
				item.suspectedCount,
				item.curedCount,
				item.currentConfirmedCount
			])
		}
	})

	spinner.stopAndPersist()
	console.log(output.toString())
	// data = data.slice(0, limit)
}
