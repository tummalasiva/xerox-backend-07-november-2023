const fs = require('fs-extra')
const path = require('path')
const moment = require('moment-timezone')
const migrationsDir = require('../env/migrationsDir')

module.exports = async (description) => {
	if (!description) {
		throw new Error('Missing parameter: description')
	}
	await migrationsDir.shouldExist()
	const source = path.join(__dirname, '../../samples/migration.js')
	const filename = `${moment().format('YYYYMMDDHHmmss')}-${description.split(' ').join('_')}.js`
	const destination = path.join(await migrationsDir.resolve(), filename)
	await fs.copy(source, destination)
	return filename
}
