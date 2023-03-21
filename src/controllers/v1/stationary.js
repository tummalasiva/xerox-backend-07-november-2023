
// Dependencies
const stationaryHelper = require("@services/helper/stationary");


module.exports = class Stationary {

    async create(req) {
        const params = req.body;
        try {
        const result = await stationaryHelper.create(params,req.decodedToken._id);
        return result;
        } catch (error) {
        return error;
        }
    }

    async update(req) {
      const params = req.body;
      const _id = req.params.id
      try {
        const result = await stationaryHelper.update(_id,params,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

    async list(req) {
        try {
          const result = await stationaryHelper.list(req);
          return result;
        } catch (error) {
          return error;
        }
      }


    async delete(req) {
      const _id = req.params.id
      try {
        const result = await stationaryHelper.delete(_id,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

};
