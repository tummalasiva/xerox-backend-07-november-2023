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
const notificationTemplateData = require('@db/notification-template/query')
const kafkaCommunication = require('@generics/kafka-communication')
const systemUserData = require('@db/systemUsers/queries')
const FILESTREAM = require('@generics/file-stream')
const utils = require('@generics/utils')

module.exports = class StoreHelper {


	static async create(body,userId) {
		try {

			body.createdBy = userId;
			let stores = await storesData.create(body);			
			if (stores && stores._id) {

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
			
				let store = await storesData.listStores(
					// params.query.type,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				
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

}