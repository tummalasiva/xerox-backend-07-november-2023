
const utilsHelper = require('@generics/utils')
const httpStatusCode = require('@generics/http-status')
const common = require('@constants/common')
const systemUserData = require('@db/systemUsers/queries')

const permissionData = require('@db/permission/queries')

module.exports = class SystemUsersHelper {
	/**
	 * create system users
	 * @method
	 * @name create
	 * @param {Object} bodyData - user create information
	 * @param {string} bodyData.email - email.
	 * @param {string} bodyData.password - email.
	 * @returns {JSON} - returns created user information
	 */
	static async create(bodyData, userId) {
		try {
			const email = bodyData.email
			const user = await systemUserData.findUsersByEmail(email)
			if (user) {
				return common.failureResponse({
					message: 'SYSTEM_USER_ALREADY_EXISTS',
					statusCode: httpStatusCode.not_acceptable,
					responseCode: 'CLIENT_ERROR',
				})
			}

            const userCode = await systemUserData.findOne({ code: bodyData.code });
			if (userCode) {
				return common.failureResponse({
					message: "Employe code exist",
					statusCode: httpStatusCode.not_acceptable,
					responseCode: 'CLIENT_ERROR',
				})
			}

            bodyData.createdBy = userId;
			bodyData.password = utilsHelper.hashPassword(bodyData.password)
			bodyData.email = { address: email, verified: false }
			let response = await systemUserData.create(bodyData)
            if(response === true){
                return common.successResponse({
                    statusCode: httpStatusCode.created,
                    message: 'USER_CREATED_SUCCESSFULLY',
                    result: response
                })
            } else {
                throw response;
            }
			
		} catch (error) {
			throw error 
		}
	}

	/**
	 * login user
	 * @method
	 * @name login
	 * @param {Object} bodyData - user login data.
	 * @param {string} bodyData.email - email.
	 * @param {string} bodyData.password - email.
	 * @returns {JSON} - returns login response
	 */
	static async login(bodyData) {
		try {
			let user = await systemUserData.findUsersByEmail(bodyData.email)
			if (!user) {
				return common.failureResponse({
					message: 'USER_DOESNOT_EXISTS',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}
			const isPasswordCorrect = utilsHelper.comparePassword(bodyData.password, user.password)
			if (!isPasswordCorrect) {
				return common.failureResponse({
					message: 'PASSWORD_INVALID',
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
			}

			let rolesInfo = "";
			if(user.role){
				rolesInfo= await permissionData.findOne({ role: user.role })
				
				user['roleInfo'] = rolesInfo;
			}

		
			const tokenDetail = {
				data: {
					_id: user._id,
					email: user.email.address,
					role: user.role,
					roleInfo: rolesInfo
				},
			}

			const accessToken = utilsHelper.generateToken(tokenDetail, process.env.ACCESS_TOKEN_SECRET, '1d')
			const refreshToken = utilsHelper.generateToken(tokenDetail, process.env.REFRESH_TOKEN_SECRET, '183d')

			delete user.password
			const result = { access_token: accessToken, refresh_token: refreshToken, user }

			return common.successResponse({
				statusCode: httpStatusCode.ok,
				message: 'LOGGED_IN_SUCCESSFULLY',
				result,
			})

		} catch (error) {
			throw error
		}
	}


    static async update(id,body,userId) {
        try {
            
            const userCode = await systemUserData.findOne({ code: body.code,_id : { $ne: id  } });
            if(userCode){
                return common.failureResponse({
					message: "Employe code exist",
					statusCode: httpStatusCode.bad_request,
					responseCode: 'CLIENT_ERROR',
				})
            }

            body.updatedAt = new Date().getTime();
            body.updatedBy = userId;
            let userdata = await systemUserData.updateOneUser({ _id: id },body);		
            if (userdata) {
    
                return common.successResponse({
                    statusCode: httpStatusCode.ok,
                    message: "Employee data updated successfully",
                    result: userdata,
                })
    
            }else {
                    return common.failureResponse({
                        message: 'Failed to update emaployee details',
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
    
            
            
            
            let user = await systemUserData.updateOneUser({ _id: id },{ deleted: true, 
                updatedBy: userId, 
                updatedAt: new Date().getTime()
             });		
    
            if (user) {
    
                return common.successResponse({
                    statusCode: httpStatusCode.ok,
                    message: "User deleted successfully",
                    result: user,
                })
    
            }else {
                    return common.failureResponse({
                        message: 'Failed to delete user',
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
			
				let users = await systemUserData.listUsers(
					// params.query.type,
					params.pageNo,
					params.pageSize,
					params.searchText
				)
				
				if (users[0].data.length < 1) {
					return common.successResponse({
						statusCode: httpStatusCode.ok,
						message: "Users not found",
						result: {
							data: [],
							count: 0,
						},
					})
				}


				return common.successResponse({
					statusCode: httpStatusCode.ok,
					message: "Users fetched successfully",
					result: {
						data: users[0].data,
						count: users[0].count,
					},
				})
			
		} catch (error) {
			throw error
		}
}


static async roles() {
    try {


            return common.successResponse({
                statusCode: httpStatusCode.ok,
                message: "User roles fetched successfully",
                result: { roles: ["admin","manager","staff"] },
            })


        
    } catch (error) {
        throw error
    }
}
}
