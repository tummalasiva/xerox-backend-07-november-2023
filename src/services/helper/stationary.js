const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')

const common = require('@constants/common')
const stationarysData = require('@db/stationary/queries')

module.exports = class StationaryHelper {


	static async create(body,userId) {
		try {

			body.createdBy = userId;
			body.updatedAt = new Date().getTime();
			body.createdAt = new Date().getTime();

			let existDoc = await stationarysData.findOne({ name: body.name });

			if(existDoc){
				return common.failureResponse({
					message: 'Stationary already exist',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}
			let stationarys = await stationarysData.create(body);		
			console.log("----------------",stationarys);	
			if (stationarys && stationarys._id) {

				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Stationary created successfully",
					result: stationarys,
				})

			}else {
					return common.failureResponse({
						message: 'Stationary not created',
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
			
				let stationary = await stationarysData.listStationary(
					params.query.entityId,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				
				if (stationary[0].data.length < 1) {
					return common.successResponse({
						statusCode: httpStatusCode.ok,
						message: "Stationarys not found",
						result: {
							data: [],
							count: 0,
						},
					})
				}


				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Stationarys fetched successfully",
					result: {
						data: stationary[0].data,
						count: stationary[0].count,
					},
				})
			
		} catch (error) {
			throw error
		}
}

static async update(id,body,userId) {
	try {

		
		let existDoc = await stationarysData.findOne({ name: body.name , _id: { $ne: id } });

		if(existDoc){
			return common.failureResponse({
				message: 'Stationary already exist',
				statusCode: httpStatusCode.bad_request,
				responseCode: 'CLIENT_ERROR',
			})
		}
		body.updatedAt = new Date().getTime();
		body.updatedBy = userId;
		let stationarys = await stationarysData.updateOneStationary({ _id: id },body);		
		if (stationarys) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Stationary updated successfully",
				result: stationarys,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to update stationary details',
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

		
		
		
		let stationarys = await stationarysData.updateOneStationary({ _id: id },{ deleted: true, 
			updatedBy: userId, 
			updatedAt: new Date().getTime()
		 });		

		if (stationarys) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Stationary deleted successfully",
				result: stationarys,
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