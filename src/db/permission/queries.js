
// Dependencies
const ObjectId = require('mongoose').Types.ObjectId
const Stationary = require('./model')

module.exports = class StationaryData {
	static async findOne(filter, projection = {}) {
		try {
			const userData = await Stationary.findOne(filter, projection).lean({
				getters: true,
			})
			return userData
		} catch (error) {
			return error
		}
	}

	static async findAllStationary(filter, projection = {}) {
		try {
			const StationaryData = await Stationary.find(filter, projection).lean({
				getters: true,
			})
			return StationaryData
		} catch (error) {
			return error
		}
	}

	static async create(data) {
		try {
			let stationary =  await new Stationary(data).save()
			return stationary;
		} catch (error) {
			throw error;
		}
	}

	static async updateOnePermission(filter, update, options = {}) {
		try {
			const res = await Stationary.updateOne(filter, update, options)
			if ((res.n === 1 && res.nModified === 1) || (res.matchedCount === 1 && res.modifiedCount === 1)) {
				return true
			} else {
				return false
			}
		} catch (error) {
			return error
		}
	}

	
	static async listPermission(page, limit, search) {
		try {
			
			let data = await Stationary.aggregate([
				{
					$match: {
						deleted: false,
						$or: [{ role: new RegExp(search, 'i') }],
					},
				},
				{
					$project: {
						role: 1,
						status:1,
						permissions:1,
                        updatedAt:1,
						createdAt:1,
						updatedBy:1,
						createdBy:1
					},
				},
				{
					$sort: { role: 1 },
				},
				{
					$facet: {
						totalCount: [{ $count: 'count' }],
						data: [{ $skip: limit * (page - 1) }, { $limit: limit }],
					},
				},
				{
					$project: {
						data: 1,
						count: {
							$arrayElemAt: ['$totalCount.count', 0],
						},
					},
				},
			]).collation({ locale: 'en', caseLevel: false })

			return data;
		} catch (error) {
			return error
		}
	}
}
