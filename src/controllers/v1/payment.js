
// Dependencies
const paymentHelper = require("@services/helper/payment");


module.exports = class Payment {

    async order(req) {
        const params = req.body;
        try {
        const result = await paymentHelper.order(params,req.decodedToken._id);
        return result;
        } catch (error) {
        return error;
        }
    }

    async confirm(req) {
        const params = req.body;
        try {

            const result = await paymentHelper.confirm(params);
            return result;

           
      
        } catch (error) {
        return error;
        }
    }
}