/**
 * name : middlewares/authenticator
 * author : Aman Kumar Gupta
 * Date : 21-Oct-2021
 * Description : Validating authorized requests
 */

const jwt = require('jsonwebtoken')

const httpStatusCode = require('@generics/http-status')
const common = require('@constants/common')
const UsersData = require('@db/users/queries')

const permissionData = require('@db/permission/queries')

module.exports = async function (req, res, next) {
	try {
		let internalAccess = false
		let guestUrl = false
		const authHeader = req.get('X-auth-token')

		await Promise.all(
			common.internalAccessUrls.map(async function (path) {
				if (req.path.includes(path)) {
					if (
						req.headers.internal_access_token &&
						process.env.INTERNAL_ACCESS_TOKEN == req.headers.internal_access_token
					) {
						internalAccess = true
					}
				}
			})
		)
		common.guestUrls.map(function (path) {
			if (req.path.includes(path)) {
				guestUrl = true
			}
		})

		if ((internalAccess || guestUrl) && !authHeader) {
			next()
			return
		}
		if (!authHeader) {
			const authHeader = req.get('X-auth-token')
			if (!authHeader) {
				throw common.failureResponse({
					message: 'UNAUTHORIZED_REQUEST',
					statusCode: httpStatusCode.unauthorized,
					responseCode: 'UNAUTHORIZED',
				})
			}
		}
		// let splittedUrl = req.url.split('/');
		// if (common.uploadUrls.includes(splittedUrl[splittedUrl.length - 1])) {
		//     if (!req.headers.internal_access_token || process.env.INTERNAL_ACCESS_TOKEN !== req.headers.internal_access_token) {
		//         throw common.failureResponse({ message: apiResponses.INCORRECT_INTERNAL_ACCESS_TOKEN, statusCode: httpStatusCode.unauthorized, responseCode: 'UNAUTHORIZED' });
		//     }
		// }

		const authHeaderArray = authHeader.split(' ')
		if (authHeaderArray[0] !== 'bearer') {
			throw common.failureResponse({
				message: 'UNAUTHORIZED_REQUEST',
				statusCode: httpStatusCode.unauthorized,
				responseCode: 'UNAUTHORIZED',
			})
		}
		try {
			decodedToken = jwt.verify(authHeaderArray[1], process.env.ACCESS_TOKEN_SECRET)
		} catch (err) {
			err.statusCode = httpStatusCode.unauthorized
			err.responseCode = 'UNAUTHORIZED'
			err.message = 'ACCESS_TOKEN_EXPIRED'
			throw err
		}

		if (!decodedToken) {
			throw common.failureResponse({
				message: 'UNAUTHORIZED_REQUEST',
				statusCode: httpStatusCode.unauthorized,
				responseCode: 'UNAUTHORIZED',
			})
		}

		/* Invalidate token when user role is updated, say from mentor to mentee or vice versa */
		// const user = await UsersData.findOne({ _id: decodedToken.data._id })

		const roleInfo = await permissionData.findOne({ role:decodedToken.data.role });

		req['roleInfo'] = roleInfo;
		// console.log(decodedToken.data,"--------------------------",roleInfo)

		// if(req.path.has )
		// if(/)
		// if (user && user.isAMentor !== decodedToken.data.isAMentor) {
		// 	throw common.failureResponse({
		// 		message: 'USER_ROLE_UPDATED',
		// 		statusCode: httpStatusCode.unauthorized,
		// 		responseCode: 'UNAUTHORIZED',
		// 	})
		// }

		// console.log("-------------------",);

		req.decodedToken = decodedToken.data

		next()
	} catch (err) {
		next(err)
	}
}
