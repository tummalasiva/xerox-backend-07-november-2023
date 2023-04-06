/**
 * name : account.js
 * author : Aman Gupta
 * created-date : 03-Nov-2021
 * Description : account helper.
 */

// Dependencies


const utilsHelper = require('@generics/utils')
const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')
const fs = require('fs');
const common = require('@constants/common')
const ordersData = require('@db/order/queries')

const storeData = require('@db/store/queries')

// const pdf = require('pdf-page-counter');

const pdf =  require("page-count");
const fs =  require("fs");
var request = require('request-promise');


module.exports = class OrderHelper {


	static async create(body,userId) {
		try {

            body.userId = userId;
			body.createdBy = userId;
			body.updatedAt = new Date().getTime();
			body.createdAt = new Date().getTime();

			
			let orders = await ordersData.create(body);		
			let storeDetails = await storeData.findOne({ _id:body.storeId });

			
			
			orders.totalCost = 0;
			if (orders && orders._id && orders.items.length > 0) {

				await Promise.all((orders.items).map(async (item) => {
	
					let side_price  =0 
					if(item.side == "one"){
						side_price = parseInt(storeDetails.meta['costOneSide']);
					} else {
						side_price = parseInt(storeDetails.meta['costTwoSide']);
					}

					let colorPrice = 0; 
					if(item.color=="bw"){
						colorPrice = parseInt(storeDetails.meta['costBlack']);
					} else {
						colorPrice = parseInt(storeDetails.meta['costColor']);
					}

					let paperSize = 0; 
					if(item.paperSize=="a4"){
						paperSize = parseInt(storeDetails.meta['sizeA4']);
					} else {
						paperSize = parseInt(storeDetails.meta['sizeA5']);
					}

					let paperQuality = 0; 
					if(item.paperQuality=="100gsm"){
						paperQuality = parseInt(storeDetails.meta['quality100Gsm']);
					} else {
						paperQuality = parseInt(storeDetails.meta['quality80gsm']);
					}


					let binding = 0; 
					if(item.binding=="Spiral"){
						binding = parseInt(storeDetails.meta['spiralBinding']);
					} else  if(item.binding=="Staples"){
						binding = parseInt(storeDetails.meta['staplesBinding']);
					} 

					orders.totalPages = 1;

					let pdfPath = await utilsHelper.getDownloadableUrl(item.documents[0])
					let buffer = await request.get(pdfPath, { encoding: null }); 
					let pagesPdf = await pdf.PdfCounter.count(buffer);

					// let data = await pdf(pdfPath);
					let totPages = parseInt(item.copies) * pagesPdf;
					
					orders['totalPages'] = pagesPdf;
					orders.totalCost  = orders.totalCost  +  ((parseInt(totPages)) * (side_price+colorPrice+paperSize+paperQuality))+binding;
					// let tot = parseInt(item.copies) *  ( )
					// orders.totalCost = 100;
					console.log(binding,"orders.totalCost",totPages,side_price,colorPrice,paperQuality,paperSize);
					
					orders['costPerPage'] = 1;
		
				}));

               
				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Order created successfully",
					result: orders,
				})

			}else {
					return common.failureResponse({
						message: 'Order not created',
						statusCode: httpStatusCode.bad_request,
						responseCode: 'CLIENT_ERROR',
					})
			} 
			
			
		} catch (error) {
			throw error
		}
	}

    static async list(params,userId) {
		try {
			
				let order = await ordersData.listOrders(
					// params.query.type,
                    userId,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				
				if (order[0].data.length < 1) {
					return common.successResponse({
						statusCode: httpStatusCode.ok,
						message: "Orders not found",
						result: {
							data: [],
							count: 0,
						},
					})
				}


				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Orders fetched successfully",
					result: {
						data: order[0].data,
						count: order[0].count,
					},
				})
			
		} catch (error) {
			throw error
		}
}

static async update(id,body,userId) {
	try {

		
		// let existDoc = await ordersData.findOne({  _id: { $ne: id } });

		// if(existDoc){
		// 	return common.failureResponse({
		// 		message: 'Order already exist',
		// 		statusCode: httpStatusCode.bad_request,
		// 		responseCode: 'CLIENT_ERROR',
		// 	})
		// }
		body.updatedAt = new Date().getTime();
		body.updatedBy = userId;
		let orders = await ordersData.updateOneOrder({ _id: id },body);		
		if (orders) {

            let newOrders = await ordersData.findOne({  _id: id });

            newOrders.totalCost = 100;
            newOrders.totalPages = 1;
            newOrders.costPerPage = 1;

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Order updated successfully",
				result: newOrders,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to update order details',
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

		
		
		
		let orders = await ordersData.updateOneOrder({ _id: id },{ deleted: true, 
			updatedBy: userId, 
			updatedAt: new Date().getTime()
		 });		

		if (orders) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Order deleted successfully",
				result: orders,
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



}