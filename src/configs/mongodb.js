

//Dependencies
const mongoose = require('mongoose')
const mongoose_autopopulate = require('mongoose-autopopulate')
const mongoose_timestamp = require('mongoose-timestamp')

const { elevateLog } = require('elevate-logger')
const logger = elevateLog.init()

module.exports = function () {
	// Added to remove depreciation warnings from logs.

	let parameters = ''
	if (process.env.REPLICA_SET_NAME) {
		parameters = '?replicaSet=' + process.env.REPLICA_SET_NAME
	}
	if (process.env.REPLICA_SET_NAME && process.env.REPLICA_SET_READ_PREFERENCE) {
		parameters = parameters + '&readPreference=' + process.env.REPLICA_SET_READ_PREFERENCE
	}

	let db
	if (!parameters) {
		db = mongoose.createConnection(process.env.MONGODB_URL, {
			useNewUrlParser: true,
		})
	} else {
		db = mongoose.createConnection(process.env.MONGODB_URL + parameters, {
			useNewUrlParser: true,
		})
	}

	db.on('error', function () {
		logger.error('Database connection error:', {
			triggerNotification: true,
		})
	})

	db.once('open', function () {
		logger.info('Connected to DB')
	})

	mongoose.plugin(mongoose_timestamp, {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	})

	mongoose.plugin(mongoose_autopopulate)

	global.db = db
}
