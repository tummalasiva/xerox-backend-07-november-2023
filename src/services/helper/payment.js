


const utilsHelper = require('@generics/utils')
const httpStatusCode = require('@generics/http-status')
// const emailNotifications = require('@generics/helpers/email-notifications')

const common = require('@constants/common')
const paymentData = require('@db/payment/queries')

const orderData = require('@db/order/queries')

const Razorpay = require('razorpay');

var crypto = require("crypto");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports = class paymentHelper {

  static async order(params, userId) {
    try {

      let orders = await instance.orders.create({
        "amount": params.amount,
        "currency": "INR",
        "receipt": params.receipt,
        "partial_payment": false,
        "notes": params.notes
      })


      orders['userId'] = userId;
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

      console.log("err", error)
      return common.failureResponse({
        message: 'Failed to create payment order ' + error,
        statusCode: httpStatusCode.bad_request,
        responseCode: 'CLIENT_ERROR',
      })

    }
  }


  static async confirm(params) {
    try {

      let body = params.razorpay_order_id + "|" + params.razorpay_payment_id;
      var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');


        


      var response = { "signatureIsValid": "false",statusCode:200 }
      if (expectedSignature === params.razorpay_signature){
        response = { "signatureIsValid": "true", statusCode:200, custom:true }

        let paymentInfo = await paymentData.findOne({ paymentId: params.razorpay_payment_id });

        let paymentUpdate = await paymentData.update({ paymentId: params.razorpay_payment_id },{ paidAt:new Date(), isPaid:true  });
        
        let  orderUpdate = await orderData.updateOneOrder({ _id: paymentInfo.orderId  },
          { paymentId:paymentInfo._id, paidAt:new Date(), isPaid:true,status:"paid" 
          });
        console.log("-----------",paymentInfo.orderId );


      }

      
      return response;

    } catch (error) {

      console.log("err", error)
      return common.failureResponse({
        message: 'Failed to create payment order ' + error,
        statusCode: httpStatusCode.bad_request,
        responseCode: 'CLIENT_ERROR',
      })

    }
  }
}