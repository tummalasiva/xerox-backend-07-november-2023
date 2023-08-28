/**
 * name : healthCheckService.js.
 * author : Aman Karki.
 * created-date : 17-Dec-2021.
 * Description : Health check helper functionality.
 */

// Dependencies

const { v1: uuidv1 } = require('uuid')
const mongodbHealthCheck = require('./mongodb')
const kafkaHealthCheck = require('./kafka')

const obj = {
	MONGO_DB: {
		NAME: 'Mongo.db',
		FAILED_CODE: 'MONGODB_HEALTH_FAILED',
		FAILED_MESSAGE: 'Mongo db is not connected',
	},
	KAFKA: {
		NAME: 'kafka',
		FAILED_CODE: 'KAFKA_HEALTH_FAILED',
		FAILED_MESSAGE: 'Kafka is not connected',
	},
	NAME: 'UserServiceHealthCheck',
	API_VERSION: '1.0',
}

let health_check = async function (req, res) {
	let checks = []
	let mongodbConnection = await mongodbHealthCheck.health_check()
	let kafkaServiceStatus = await kafkaHealthCheck.health_check()

	checks.push(checkResult('MONGO_DB', mongodbConnection))
	checks.push(checkResult('KAFKA', kafkaServiceStatus))

	let checkServices = checks.filter((check) => check.healthy === false)

	let result = {
		name: obj.NAME,
		version: obj.API_VERSION,
		healthy: checkServices.length > 0 ? false : true,
		checks: checks,
	}

	let responseData = response(req, result)
	res.status(200).json(responseData)
}

let checkResult = function (serviceName, isHealthy) {
	return {
		name: obj[serviceName].NAME,
		healthy: isHealthy,
		err: !isHealthy ? obj[serviceName].FAILED_CODE : '',
		errMsg: !isHealthy ? obj[serviceName].FAILED_MESSAGE : '',
	}
}

let healthCheckStatus = function (req, res) {
	let responseData = response(req)
	res.status(200).json(responseData)
}

let response = function (req, result = {}) {
	return {
		id: 'userService.Health.API',
		ver: '1.0',
		ts: new Date(),
		params: {
			resmsgid: uuidv1(),
			msgid: req.headers['msgid'] || req.headers.msgid || uuidv1(),
			status: 'successful',
			err: 'null',
			errMsg: 'null',
		},
		status: 200,
		result: result,
	}
}

module.exports = {
	healthCheckStatus: healthCheckStatus,
	health_check: health_check,
}
