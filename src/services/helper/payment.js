


const utilsHelper = require('@generics/utils')
const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')

const common = require('@constants/common')
const paymentData = require('@db/payment/queries')

const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


module.exports = class paymentHelper {

static async order(params,userId) {
	try {

        let orders = await instance.orders.create({
            "amount": params.amount,
            "currency": "INR",
            "receipt": params.receipt,
            "partial_payment": false,
            "notes":params.notes
          })
          

          orders['userId'] =userId;
          orders['orderId'] = params.orderId;
          orders['paymentId'] = orders.id;
          delete orders.id;
          
          let paymentInfo = await paymentData.create(orders);		
          

         return common.successResponse({
            statusCode: httpStatusCode.ok,
            message: "Payment Order fetched successfully",
            result: paymentInfo,
        })

	
		
		
	} catch (error) {

        console.log("err",error)
        return common.failureResponse({
            message: 'Failed to create payment order ' + error,
            statusCode: httpStatusCode.bad_request,
            responseCode: 'CLIENT_ERROR',
        })
	
	}
}
}