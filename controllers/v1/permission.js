
// Dependencies
const permissionHelper = require("@services/helper/permission");


module.exports = class Permission {

    async addRole(req) {
        const params = req.body;
        try {
        const result = await permissionHelper.addRole(params,req.decodedToken._id);
        return result;
        } catch (error) {
        return error;
        }
    }

    async update(req) {
      const params = req.body;
      const _id = req.params.id
      try {
        const result = await permissionHelper.update(_id,params,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

    async list(req) {
        try {
          const result = await permissionHelper.list(req);
          return result;
        } catch (error) {
          return error;
        }
      }

    async get(req) {
        const _id = req.params.id
        try {
          const result = await permissionHelper.get(_id,req.decodedToken._id);
          return result;
        } catch (error) {
          return error;
        }
      }

    async delete(req) {
      const _id = req.params.id
      try {
        const result = await permissionHelper.delete(_id,req.decodedToken._id);
        return result;
      } catch (error) {
        return error;
      }
    }

    async modules(req) {
        const _id = req.params.id
        try {
          const result = await permissionHelper.modules();
          return result;
        } catch (error) {
          return error;
        }
    }

};
