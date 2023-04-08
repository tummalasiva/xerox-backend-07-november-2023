
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

	static async update(filter, update, options = {}) {
		try {
			const res = await Payment.updateOne(filter, update, options)
			if ((res.n === 1 && res.nModified === 1) || (res.matchedCount === 1 && res.modifiedCount === 1)) {
				return true
			} else {
				return false
			}
		} catch (error) {
			return error
		}
	}
}