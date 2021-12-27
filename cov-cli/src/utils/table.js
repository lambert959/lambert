const { green, red, yellow, dim } = require('chalk')

module.exports = {
	single: [
		`#`,
		`区域`,
		`病倒总数`,
		`${red(`死亡总数`)}`,
		`${dim(`疑似案例`)}`,
		`${green(`治愈总数`)}`,
		`${yellow(`当前确诊`)}`
	],
	colored: [
		`#`,
		`国家`,
		`病倒总数`,
		`${red(`死亡总数`)}`,
		`${dim(`疑似案例`)}`,
		`${green(`治愈总数`)}`,
		`${yellow(`当前确诊`)}`
	],
	local: [
		`#`,
		`省`,
		`病倒总数`,
		`${red(`死亡总数`)}`,
		`${dim(`疑似案例`)}`,
		`${green(`治愈总数`)}`,
		`${yellow(`当前确诊`)}`
	],
	style: { head: ['cyan'] },
	borderless: {
		top: '',
		'top-mid': '',
		'top-left': '',
		'top-right': '',
		bottom: '',
		'bottom-mid': '',
		'bottom-left': '',
		'bottom-right': '',
		left: '',
		'left-mid': '',
		mid: '',
		'mid-mid': '',
		right: '',
		'right-mid': '',
		middle: ' '
	},
	sortingKeys: {
		country: 'countryName',
		cases: 'confirmedCount',
		deaths: 'deadCount',
		recovered: 'curedCount',
		active: 'currentConfirmedCount',
		suspected: 'suspectedCount'
	}
}
