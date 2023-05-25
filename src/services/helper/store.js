/**
 * name : account.js
 * author : Aman Gupta
 * created-date : 03-Nov-2021
 * Description : account helper.
 */

// Dependencies
const bcryptJs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const utilsHelper = require('@generics/utils')
const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')

const common = require('@constants/common')
const storesData = require('@db/store/queries')
const orderData = require('@db/order/queries')

const systemUsersData = require('@db/systemUsers/queries')

module.exports = class StoreHelper {


	static async create(body,userId) {
		try {

			body.createdBy = userId;
			body.updatedAt = new Date().getTime();
			body.createdAt = new Date().getTime();

			let existDoc = await storesData.findOne({ name: body.name });

			if(existDoc){
				return common.failureResponse({
					message: 'Store already exist',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}
			let stores = await storesData.create(body);		
			if (stores && stores._id) {

				 await systemUsersData.updateOneUser({ _id: ObjectId(userId)  },{ $push: { store:stores._id }  });

				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Store created successfully",
					result: stores,
				})

			}else {
					return common.failureResponse({
						message: 'Store not created',
						statusCode: httpStatusCode.bad_request,
						responseCode: 'CLIENT_ERROR',
					})
			} 
			
			
		} catch (error) {
			throw error
		}
	}

    static async list(params) {
		try {

			let filters = {};

			let userInfo =  await systemUsersData.findOne({ _id: params.decodedToken._id });
			
			if(userInfo){

				let ids = userInfo.store.map( function(storeIds){
					let ids = ObjectId(storeIds);
					return ids
				})

				 filters = {
					_id: { $in: ids  }
				}
			}
			console.log("filters ------------------",filters);

				let store = await storesData.listStores(
					filters,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				console.log(store);
				if (store[0].data.length < 1) {

					return common.successResponse({
						statusCode: httpStatusCode.ok,
						message: "Stores not found",
						result: {
							data: [],
							count: 0,
						},
					})
				}


				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Stores fetched successfully",
					result: {
						data: store[0].data,
						count: store[0].count,
					},
				})
			
		} catch (error) {
			throw error
		}
}

static async update(id,body,userId) {
	try {

		
		let existDoc = await storesData.findOne({ name: body.name , _id: { $ne: id } });

		if(existDoc){
			return common.failureResponse({
				message: 'Store already exist',
				statusCode: httpStatusCode.bad_request,
				responseCode: 'CLIENT_ERROR',
			})
		}
		body.updatedAt = new Date().getTime();
		body.updatedBy = userId;
		let stores = await storesData.updateOneStore({ _id: id },body);		
		if (stores) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Store updated successfully",
				result: stores,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to update store details',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
		} 
		
		
	} catch (error) {
		throw error
	}
}
static async delete(id,userId) {
	try {

		
		
		
		let stores = await storesData.updateOneStore({ _id: id },{ deleted: true, 
			updatedBy: userId, 
			updatedAt: new Date().getTime()
		 });		

		if (stores) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Store deleted successfully",
				result: stores,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to delete details',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
		} 
		
		
	} catch (error) {
		throw error
	}
}
static async addReviewToStore(body,storeId,orderId) {
	try {
		const orderRes = await orderData.updateOneOrder({
			_id:orderId
		},{
			feedBack:body
		})
		const result = await storesData.pushFeedBack(storeId,body);
		return common.successResponse({
			statusCode: httpStatusCode.ok,
			message: "Review has been added",
		})
	} catch (error) {
		throw error
	}
}

}