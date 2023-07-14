const systemUsersHelper = require("@services/helper/systemUsers");

module.exports = class SystemUsers {
  /**
   * create system users
   * @method
   * @name create
   * @param {Object} bodyData - user create information
   * @param {string} bodyData.email - email.
   * @param {string} bodyData.password - email.
   * @returns {JSON} - returns created user information
   */

  async create(req) {
    const params = req.body;
    try {
      const createdAccount = await systemUsersHelper.create(
        params,
        req.decodedToken._id
      );
      return createdAccount;
    } catch (error) {
      return error;
    }
  }

  /**
   * login system user
   * @method
   * @name login
   * @param {Object} bodyData - user login data.
   * @param {string} bodyData.email - email.
   * @param {string} bodyData.password - email.
   * @returns {JSON} - returns login response
   */

  async login(req) {
    const params = req.body;
    try {
      const loggedInAccount = await systemUsersHelper.login(params);
      return loggedInAccount;
    } catch (error) {
      return error;
    }
  }

  async update(req) {
    const params = req.body;
    const _id = req.params.id;
    try {
      const result = await systemUsersHelper.update(
        _id,
        params,
        req.decodedToken._id
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async list(req) {
    try {
      const result = await systemUsersHelper.list(req);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(req) {
    const _id = req.params.id;
    try {
      const result = await systemUsersHelper.delete(_id, req.decodedToken._id);
      return result;
    } catch (error) {
      return error;
    }
  }
  async roles(req) {
    const _id = req.params.id;
    try {
      const result = await systemUsersHelper.roles(_id, req.decodedToken._id);
      return result;
    } catch (error) {
      return error;
    }
  }
};
