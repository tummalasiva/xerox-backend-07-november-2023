
// Dependencies
const ObjectId = require('mongoose').Types.ObjectId
const Orders = require('./model')


module.exports = class OrdersData {
	static async findOne(filter, projection = {}) {
		try {
			const userData = await Orders.findOne(filter, projection).lean({
				getters: true,
			})
			return userData
		} catch (error) {
			return error
		}
	}

	static async findAllOrders(filter, projection = {}) {
		try {
			const OrdersData = await Orders.find(filter, projection).lean({
				getters: true,
			})
			return OrdersData
		} catch (error) {
			return error
		}
	}

	static async create(data) {
		try {
			let store =  await new Orders(data).save()
			return store;
		} catch (error) {
			throw error;
		}
	}

	static async updateOneOrder(filter, update, options = {}) {
		try {
			const res = await Orders.updateOne(filter, update, options)
			if ((res.n === 1 && res.nModified === 1) || (res.matchedCount === 1 && res.modifiedCount === 1)) {
				return true
			} else {
				return false
			}
		} catch (error) {
			return error
		}
	}

	
	static async listOrders(filters,page, limit, search) {
		try {

			console.log("filters",filters);
			let data = await Orders.aggregate([
				{
					$match: {
					   $and:[ filters],
						// $or: [{ name: new RegExp(search, 'i') }],
					},
				},
				{
					$project: {
						userId: 1,
						documents: 1,
						copies: 1,
						color:1,
                        paperSize:1,
                        paperQuality: 1,
                        binding:1,
                        storeId:1,
                        status:1,
                        totalCost:1,
                        totalPages:1,
						updatedAt:1,
						createdAt:1,
						updatedBy:1,
						createdBy:1,
						items:1,
						isPaid:1,
						paidAt:1,
						orderId:1
					},
				},
				{
					$sort: { createdAt: -1 },
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
