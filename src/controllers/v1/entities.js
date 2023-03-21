
const userEntityHelper = require('@services/helper/entities')

module.exports = class Entity {
	/**
	 * @api {post} /user/v1/userentity/create
	 * @apiVersion 1.0.0
	 * @apiName Creates User Entity
	 * @apiGroup userentity
	 * @apiParamExample {json} Request-Body:
	 * {
	 *    "value": "DO",
	 *    "label": "District Official",
	 *    "type": "roles"
	 * }
	 * @apiSampleRequest /user/v1/form/create
	 * @apiParamExample {json} Response:
	 * {
	 *   "responseCode": 'OK',
	 *   "message": "User entity created successfully",
	 *   "result": []
	 * }
	 * @apiUse successBody
	 * @apiUse errorBody
	 */

	/**
	 * create user entity
	 * @method
	 * @name create
	 * @param {Object} req -request data.
	 * @param {string} req.decodedToken._id - user id.
	 * @returns {JSON} - user entities creation object.
	 */

	async create(req) {
		const params = req.body
		try {
			const createdUserEntity = await userEntityHelper.create(params, req.decodedToken._id)
			return createdUserEntity
		} catch (error) {
			return error
		}
	}

	/**
	 * updates user entity
	 * @method
	 * @name update
	 * @param {Object} req - request data.
	 * @param {string} req.decodedToken._id - user id.
	 * @param {string} req.params.id - entity id.
	 * @returns {JSON} - user entities updation response.
	 */

	async update(req) {
		const params = req.body
		const _id = req.params.id
		try {
			const updatedEntity = await userEntityHelper.update(params, _id, req.decodedToken._id)
			return updatedEntity
		} catch (error) {
			return error
		}
	}

	/**
	 * reads user entities
	 * @method
	 * @name read
	 * @param {Object} req - request data.
	 * @returns {JSON} - user entities.
	 */

	async read(req) {
		const params = req.query
		try {
			const form = await userEntityHelper.read(params)
			return form
		} catch (error) {
			return error
		}
	}

	/**
	 * deletes user entity
	 * @method
	 * @name delete
	 * @param {Object} req - request data.
	 * @param {string} req.params.id - entity id.
	 * @returns {JSON} - user entities deletion response.
	 */

	async delete(req) {
		const _id = req.params.id
		try {
			const updatedEntity = await userEntityHelper.delete(_id)
			return updatedEntity
		} catch (error) {
			return error
		}
	}
}
