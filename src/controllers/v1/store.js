
// Dependencies
const storeHelper = require("@services/helper/store");

const common = require("@constants/common");
const httpStatusCode = require("@generics/http-status");

module.exports = class Account {

    async create(req) {
        const params = req.body;
        try {
        const result = await storeHelper.create(params,req.decodedToken._id);
        return result;
        } catch (error) {
        return error;
        }
    }

    async update(req) {
      const params = req.body;
      const _id = req.params.id
      try {
        const result = await storeHelper.update(_id,params,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

    async list(req) {
        try {
          const result = await storeHelper.list(req);
          return result;
        } catch (error) {
          return error;
        }
      }


    async delete(req) {
      const _id = req.params.id
      try {
        const result = await storeHelper.delete(_id,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

};
