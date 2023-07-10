/**
 * name : account.js
 * author : Aman Gupta
 * created-date : 03-Nov-2021
 * Description : account helper.
 */

// Dependencies

const utilsHelper = require("@generics/utils");
const httpStatusCode = require("@generics/http-status");
// const emailNotifications = require('@generics/helpers/email-notifications')
const fs = require("fs");
const common = require("@constants/common");
const ordersData = require("@db/order/queries");

const storeData = require("@db/store/queries");
const ObjectId = require("mongoose").Types.ObjectId;

// const pdf = require('pdf-page-counter');

const pdf = require("page-count");

var request = require("request-promise");

const notifications = require("../../generics/helpers/notifications");

const usersData = require("@db/users/queries");

const orderid = require("order-id")("key");

module.exports = class OrderHelper {
  static async create(body, userId) {
    try {
      body["orderId"] = orderid.generate();

      body.userId = userId;
      body.createdBy = userId;
      body.updatedAt = new Date().toISOString();
      body.createdAt = new Date().toISOString();

      let storeDetails = await storeData.findOne({ _id: body.storeId });

      body.totalCost = 0;
      body.totalPages = 0;

      if (body && body.items.length > 0) {
        await Promise.all(
          body.items.map(async (item, index) => {
            let side_price = 0;
            if (item.side == "one") {
              side_price = parseInt(storeDetails.meta["costOneSide"]);
            } else {
              side_price = parseInt(storeDetails.meta["costTwoSide"]);
            }

            body.items[index]["side"] = item.side;

            let colorPrice = 0;
            if (item.colors.color == "bw") {
              colorPrice = parseInt(storeDetails.meta["costBlack"]);
            } else {
              colorPrice = parseInt(storeDetails.meta["costColor"]);
            }

            body.items[index]["color"] = item.color;

            let paperSize = 0;
            if (item.paperSize == "a4") {
              paperSize = parseInt(storeDetails.meta["sizeA4"]);
            } else {
              paperSize = parseInt(storeDetails.meta["sizeA5"]);
            }

            body.items[index]["paperSize"] = item.paperSize;

            let paperQuality = 0;
            if (item.paperQuality == "100gsm") {
              paperQuality = parseInt(storeDetails.meta["quality100Gsm"]);
            } else {
              paperQuality = parseInt(storeDetails.meta["quality80gsm"]);
            }
            body.items[index]["paperQuality"] = item.paperQuality;

            let binding = 0;
            if (item.binding == "Spiral") {
              binding = parseInt(storeDetails.meta["spiralBinding"]);
            } else if (item.binding == "Staples") {
              binding = parseInt(storeDetails.meta["staplesBinding"]);
            }
            body.items[index]["binding"] = item.binding;

            let pdfPath = await utilsHelper.getDownloadableUrl(
              item.documents[0]
            );
            let buffer = await request.get(pdfPath, { encoding: null });
            let pagesPdf = await pdf.PdfCounter.count(buffer);

            body.items[index]["totalPages"] = pagesPdf;
            // let data = await pdf(pdfPath);
            let totPages = parseInt(item.copies) * pagesPdf;

            body.totalPages = body.totalPages + pagesPdf;

            // body['totalPages'] = pagesPdf;

            let cost =
              parseInt(
                parseInt(totPages) *
                  (side_price + colorPrice + paperSize + paperQuality)
              ) + binding;

            body.items[index]["cost"] = parseInt(cost);
            body.totalCost = body.totalCost + parseInt(cost);
            // let tot = parseInt(item.copies) *  ( )
            // orders.totalCost = 100;
            console.log(
              index,
              "orders.totalCost",
              totPages,
              side_price,
              colorPrice,
              paperQuality,
              paperSize
            );

            body["costPerPage"] = 1;
          })
        );

        let orders = await ordersData.create(body);

        return common.successResponse({
          statusCode: httpStatusCode.ok,
          message: "Order created successfully",
          result: orders,
        });
      } else {
        return common.failureResponse({
          message: "Order not created",
          statusCode: httpStatusCode.bad_request,
          responseCode: "CLIENT_ERROR",
        });
      }
    } catch (error) {
      console.log("-----", error);
      throw error;
    }
  }

  //   static async create(body, userId) {
  //     try {
  //       body.orderId = orderid.generate();
  //       body.userId = userId;
  //       body.createdBy = userId;
  //       body.updatedAt = new Date().toISOString();
  //       body.createdAt = new Date().toISOString();

  //       let storeDetails = await storeData.findOne({ _id: body.storeId });

  //       body.totalCost = 0;
  //       body.totalPages = 0;

  //       if (body && body.items.length > 0) {
  //         await Promise.all(
  //           body.items.map(async (item, index) => {
  //             let side_price = 0;
  //             if (item.side === "one") {
  //               side_price = parseInt(storeDetails.meta["costOneSide"]);
  //             } else {
  //               side_price = parseInt(storeDetails.meta["costTwoSide"]);
  //             }

  //             body.items[index].side = item.side;

  //             let colorPrice = 0;
  //             if (item.colors.color === "bw") {
  //               colorPrice = parseInt(storeDetails.meta["costBlack"]);
  //             } else {
  //               colorPrice = parseInt(storeDetails.meta["costColor"]);
  //             }

  //             body.items[index].color = item.color;

  //             let paperSize = 0;
  //             if (item.paperSize === "a4") {
  //               paperSize = parseInt(storeDetails.meta["sizeA4"]);
  //             } else {
  //               paperSize = parseInt(storeDetails.meta["sizeA5"]);
  //             }

  //             body.items[index].paperSize = item.paperSize;

  //             let paperQuality = 0;
  //             if (item.paperQuality === "100gsm") {
  //               paperQuality = parseInt(storeDetails.meta["quality100Gsm"]);
  //             } else {
  //               paperQuality = parseInt(storeDetails.meta["quality80gsm"]);
  //             }
  //             body.items[index].paperQuality = item.paperQuality;

  //             let binding = 0;
  //             if (item.binding === "Spiral") {
  //               binding = parseInt(storeDetails.meta["spiralBinding"]);
  //             } else if (item.binding === "Staples") {
  //               binding = parseInt(storeDetails.meta["staplesBinding"]);
  //             }
  //             body.items[index].binding = item.binding;

  //             let pdfPath = await utilsHelper.getDownloadableUrl(item.documents);
  //             let buffer = await request.get(pdfPath, { encoding: null });
  //             let pagesPdf = await pdf.PdfCounter.count(buffer);

  //             body.items[index].totalPages = pagesPdf;

  //             let totPages = parseInt(item.copies) * pagesPdf;

  //             body.totalPages += pagesPdf;

  //             let cost =
  //               parseInt(totPages) *
  //                 (side_price + colorPrice + paperSize + paperQuality) +
  //               binding;

  //             body.items[index].cost = parseInt(cost);
  //             body.totalCost += parseInt(cost);

  //             body.costPerPage = 1;
  //           })
  //         );

  //         let orders = await ordersData.create(body);
  //         console.log(orders, "ordddddservice");
  //         return common.successResponse({
  //           statusCode: httpStatusCode.OK,
  //           message: "Order created successfully",
  //           result: orders,
  //         });
  //       } else {
  //         return common.failureResponse({
  //           message: "Order not created",
  //           statusCode: httpStatusCode.BAD_REQUEST,
  //           responseCode: "CLIENT_ERROR",
  //         });
  //       }
  //     } catch (error) {
  //       console.log("Error:", error);
  //       throw error;
  //     }
  //   }

  static async list(params, userId, role) {
    try {
      let filters = {};
      if (role == "customer") {
        filters["userId"] = ObjectId(userId);
      }

      if (params.query.storeId) {
        filters["storeId"] = ObjectId(params.query.storeId);
      }

      if (params.query.status) {
        filters["status"] = params.query.status;
      }

      if (params.query.startDate && params.query.endDate) {
        filters["createdAt"] = {
          $gte: new Date(params.query.startDate),
          $lte: new Date(params.query.endDate),
        };
      }
      let order = await ordersData.listOrders(
        // params.query.type,
        filters,
        params.pageNo,
        params.pageSize,
        params.searchText
      );

      if (order[0].data.length < 1) {
        return common.successResponse({
          statusCode: httpStatusCode.ok,
          message: "Orders not found",
          result: {
            data: [],
            count: 0,
          },
        });
      }

      let totalAmount = 0;
      let pages = 0;
      let colorPages = 0;
      let blackandwhite = 0;
      await Promise.all(
        order[0].data.map(async function (orderInfo) {
          totalAmount = totalAmount + orderInfo.totalCost;
          pages = pages + orderInfo.totalPages;
          await Promise.all(
            orderInfo.items.map(async function (items) {
              if (items.color == "bw") {
                blackandwhite = blackandwhite + orderInfo.totalPages;
              } else {
                colorPages = colorPages + orderInfo.totalPages;
              }
            })
          );
        })
      );

      return common.successResponse({
        statusCode: httpStatusCode.ok,
        message: "Orders fetched successfully",
        result: {
          data: order[0].data,
          count: order[0].count,
          totalAmount: totalAmount,
          pages: pages,
          colorPages: colorPages,
          blackandwhite: blackandwhite,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, body, userId) {
    try {
      body.updatedAt = new Date().getTime();
      body.updatedBy = userId;
      let orders = await ordersData.updateOneOrder({ _id: id }, body);

      if (body.status == "accepted") {
        let userInfo = await usersData.findOne({ _id: userId });

        await notifications.sendSms({
          to: userInfo.mobile,
          message: utilsHelper.composeEmailBody(common.ORDER_ACCEPT_MESSAGE, {
            name: userInfo.name,
            orderId: id,
          }),
          template_id: process.env.ORDER_ACCEPTED_TEMPLATE_ID,
        });
      } else if (body.status == "rejected") {
      }
      if (orders) {
        let newOrders = await ordersData.findOne({ _id: id });

        return common.successResponse({
          statusCode: httpStatusCode.ok,
          message: "Order updated successfully",
          result: newOrders,
        });
      } else {
        return common.failureResponse({
          message: "Failed to update order details",
          statusCode: httpStatusCode.bad_request,
          responseCode: "CLIENT_ERROR",
        });
      }
    } catch (error) {
      throw error;
    }
  }
  static async delete(id, userId) {
    try {
      let orders = await ordersData.updateOneOrder(
        { _id: id },
        { deleted: true, updatedBy: userId, updatedAt: new Date().getTime() }
      );

      if (orders) {
        return common.successResponse({
          statusCode: httpStatusCode.ok,
          message: "Order deleted successfully",
          result: orders,
        });
      } else {
        return common.failureResponse({
          message: "Failed to delete details",
          statusCode: httpStatusCode.bad_request,
          responseCode: "CLIENT_ERROR",
        });
      }
    } catch (error) {
      throw error;
    }
  }
  static async details(id, userId) {
    try {
      let orders = await ordersData.findOne({ _id: id });

      if (orders) {
        return common.successResponse({
          statusCode: httpStatusCode.ok,
          message: "Order fetched successfully",
          result: orders,
        });
      } else {
        return common.failureResponse({
          message: "Failed to find the order details",
          statusCode: httpStatusCode.bad_request,
          responseCode: "CLIENT_ERROR",
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
