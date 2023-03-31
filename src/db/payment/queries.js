
// Dependencies
const ObjectId = require('mongoose').Types.ObjectId
const Payment = require('./model')

module.exports = class PaymentData {
	static async findOne(filter, projection = {}) {
		try {
			const userData = await Payment.findOne(filter, projection).lean({
				getters: true,
			})
			return userData
		} catch (error) {
			return error
		}
	}

	static async findAllStationary(filter, projection = {}) {
		try {
			const PaymentData = await Payment.find(filter, projection).lean({
				getters: true,
			})
			return PaymentData
		} catch (error) {
			return error
		}
	}

	static async create(data) {
		try {
			let payment =  await new Payment(data).save()
			return payment;
		} catch (error) {
			throw error;
		}
	}

}