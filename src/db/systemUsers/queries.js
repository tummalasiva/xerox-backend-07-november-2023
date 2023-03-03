
const SystemUsers = require('./model')

module.exports = class SystemUsersData {

	static async findOne(filter, projection = {}) {
		try {
			const userData = await SystemUsers.findOne(filter, projection).lean({
				getters: true,
			})
			return userData
		} catch (error) {
			return error
		}
	}

	static async findUsersByEmail(email) {
		try {
			const userData = await SystemUsers.findOne({ 'email.address': email }).lean()
			return userData
		} catch (error) {
			return error
		}
	}

	static async create(data) {
		try {
			await new SystemUsers(data).save()
			return true
		} catch (error) {
			return error
		}
	}

	static async updateOneUser(filter, update, options = {}) {
		try {
			const res = await SystemUsers.updateOne(filter, update, options)
			if ((res.n === 1 && res.nModified === 1) || (res.matchedCount === 1 && res.modifiedCount === 1)) {
				return true
			} else {
				return false
			}
		} catch (error) {
			return error
		}
	}


	static async listUsers(page, limit, search) {
		try {
			
			let data = await SystemUsers.aggregate([
				{
					$match: {
						deleted: false,
						$or: [{ name: new RegExp(search, 'i') }],
					},
				},
				{
					$project: {
						name: 1,
						code: 1,
						email: 1,
						mobile:1,
						role: 1,
						updatedAt:1,
						createdAt:1,
						updatedBy:1,
						createdBy:1
					},
				},
				{
					$sort: { name: 1 },
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
