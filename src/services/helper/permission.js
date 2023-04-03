const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')

const common = require('@constants/common')
const permissionsData = require('@db/permission/queries')


module.exports = class PermissionHelper {


	static async addRole(body,userId) {
		try {

			body.createdBy = userId;
			body.updatedAt = new Date().getTime();
			body.createdAt = new Date().getTime();

			let existDoc = await permissionsData.findOne({ role: body.name });

			if(existDoc){
				return common.failureResponse({
					message: 'Role already exist',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}
			let permissions = await permissionsData.create(body);		
			if (permissions && permissions._id) {

				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Role created successfully",
					result: permissions,
				})

			}else {
					return common.failureResponse({
						message: 'Role not created',
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

			
				let permission = await permissionsData.listPermission(
					// params.query.type,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				
				if (permission[0].data.length < 1) {
					return common.successResponse({
						statusCode: httpStatusCode.ok,
						message: "Roles not found",
						result: {
							data: [],
							count: 0,
						},
					})
				}


				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Roles fetched successfully",
					result: {
						data: permission[0].data,
						count: permission[0].count,
					},
				})
			
		} catch (error) {
			throw error
		}
}

static async update(id,body,userId) {
	try {

		
		let existDoc = await permissionsData.findOne({ role: body.name , _id: { $ne: id } });

		if(existDoc){
			return common.failureResponse({
				message: 'Role already exist',
				statusCode: httpStatusCode.bad_request,
				responseCode: 'CLIENT_ERROR',
			})
		}
		body.updatedAt = new Date().getTime();
		body.updatedBy = userId;
		let permissions = await permissionsData.updateOnePermission({ _id: id },body);		
		if (permissions) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Role permission updated successfully",
				result: permissions,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to update role permissions details',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
		} 
		
		
	} catch (error) {
		throw error
	}
}

static async modules() {
	try {
		let modules = ["employees","stores","jobs","stationary"]
		
			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Modules fetched successfully",
				result: modules,
			})

		
		
	} catch (error) {
		throw error
	}
}

static async delete(id,userId) {
	try {

		
		
		
		let permissions = await permissionsData.updateOnePermission({ _id: id },{ deleted: true, 
			updatedBy: userId, 
			updatedAt: new Date().getTime()
		 });		

		if (permissions) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Role deleted successfully",
				result: permissions,
			})

		}else {
				return common.failureResponse({
					message: 'Failed to delete role',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
		} 
		
		
	} catch (error) {
		throw error
	}
}

static async get(id) {
	try {

		let permissions = await permissionsData.findOne({ _id: id });		

		if (permissions) {

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: "Roles fetched successfully",
				result: permissions,
			})

		}else {
				return common.failureResponse({
					message: 'Role not found',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
		} 
		
		
	} catch (error) {
		throw error
	}
}


}