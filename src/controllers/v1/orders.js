
// Dependencies
const orderHelper = require("@services/helper/order");

const common = require("@constants/common");
const httpStatusCode = require("@generics/http-status");

module.exports = class Account {

    async create(req) {
        const params = req.body;
        try {
        const result = await orderHelper.create(params,req.decodedToken._id);
        return result;
        } catch (error) {
        return error;
        }
    }

    async update(req) {
      const params = req.body;
      const _id = req.params.id
      try {
        const result = await orderHelper.update(_id,params,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

    async list(req) {
        try {
          const result = await orderHelper.list(
            req,
            req.decodedToken._id,
            req.roleInfo ? req.roleInfo : "customer",
            );
          return result;
        } catch (error) {
          return error;
        }
      }


    async delete(req) {
      const _id = req.params.id
      try {
        const result = await orderHelper.delete(_id,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }
    async details(req) {
      const _id = req.params.id
      try {
        const result = await orderHelper.details(_id,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

};
