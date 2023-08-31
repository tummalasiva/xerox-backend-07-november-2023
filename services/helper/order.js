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
      if (!storeDetails) throw new Error("Store not found!");

      body.totalCost = 0;
      body.totalPages = 0;

      console.log(body.items, "item");

      if (body && body.items.length > 0) {
        await Promise.all(
          body.items.map(async (item, index) => {
            body.items[index]["documents"] = item.document;

            body.items[index]["pageRange"] = item.pageRange;

            // sides
            let side_price = 0;
            if (item.sides == "one") {
              side_price = parseInt(storeDetails.meta["costOneSide"]);
            } else {
              side_price = parseInt(storeDetails.meta["costTwoSide"]);
            }

            body.items[index]["side"] = item.sides;

            // bond
            let bond_price = 0;
            if (item.bondPage.selected === "yes") {
              let perBondPrice = parseInt(storeDetails.meta["bondPage"]) || 0;
              bond_price = parseInt(storeDetails.meta["bondPage"]) || 0;
            }

            body.items[index]["bondPage"] = {
              selected: item.bondPage.selected === "yes" ? true : false,
              description: item.bondPage.description,
              total: item.bondPage.total,
            };

            // color price
            let totalColorPages = 0;
            let totalBlackPages = 0;
            let colorPrice = 0;
            let blackPrice = 0;
            if (item.colors.color == "bw") {
              totalBlackPages = item.totalPages;
              totalColorPages = 0;
              blackPrice = parseInt(storeDetails.meta["costBlack"]);
              colorPrice = 0;
            } else if (item.colors.color == "multi") {
              totalColorPages = item.totalPages;
              totalBlackPages = 0;
              colorPrice = parseInt(storeDetails.meta["costColor"]);
              blackPrice = 0;
            } else if (item.colors.color === "colpar") {
              totalBlackPages =
                item.totalPages - item.colorPar.pageNumbers.length;
              totalColorPages = item.colorPar.pageNumbers.length;
              colorPrice = parseInt(storeDetails.meta["costColor"]);
              blackPrice = parseInt(storeDetails.meta["costBlack"]);
            }

            body.items[index]["colors"] = {
              color: item.colors.color,
            };

            if (item.colors.color === "colorPar") {
              body.items[index]["colorPar"] = {
                description: item.colorPar.description,
                total: item.colorPar.total,
                pageNumbers: item.colorPar.pageNumbers,
              };
            }

            let paperSize = 0;
            if (item.paperSize == "a4") {
              paperSize = parseInt(storeDetails.meta["sizeA4"]);
            } else if (item.paperSize == "a5") {
              paperSize = parseInt(storeDetails.meta["sizeA5"]);
            } else if (item.paperSize == "legal") {
              paperSize = parseInt(storeDetails.meta["legal"]);
            } else if (item.paperSize == "letter") {
              paperSize = parseInt(storeDetails.meta["letter"]);
            } else if (item.paperSize == "b5") {
              paperSize = parseInt(storeDetails.meta["sizeB5"]);
            } else if (item.paperSize == "a6") {
              paperSize = parseInt(storeDetails.meta["sizeA6"]);
            } else if (item.paperSize == "postCard") {
              paperSize = parseInt(storeDetails.meta["postCard"]);
            } else if (item.paperSize == "5*7") {
              paperSize = parseInt(storeDetails.meta["size5X7"]);
            } else if (item.paperSize == "4*6") {
              paperSize = parseInt(storeDetails.meta["size4X6"]);
            } else if (item.paperSize == "3.5*5") {
              paperSize = parseInt(storeDetails.meta["size35X5"]);
            }

            body.items[index]["paperSize"] = item.paperSize;
            body.items[index]["printLayout"] = item.printLayout;

            let binding = 0;
            if (item.binding == "Spiral") {
              binding = parseInt(storeDetails.meta["spiralBinding"]);
            } else if (item.binding == "Staples") {
              binding = parseInt(storeDetails.meta["staplesBinding"]);
            } else if (item.binding == "StickFile") {
              binding = parseInt(storeDetails.meta["stickFile"]);
            }
            body.items[index]["binding"] = item.binding;

            body.items[index]["totalPages"] = item.totalPages;

            let cost = 0;

            // Calculate cost for each factor
            const copies = parseInt(item.copies);
            const totalCostPerPageColor = colorPrice * totalColorPages;

            const totalCostPerPageBlack = blackPrice * totalBlackPages;

            const totalCost =
              copies *
                (totalCostPerPageBlack +
                  totalCostPerPageColor +
                  side_price +
                  paperSize +
                  bond_price) +
              binding;

            cost += totalCost;

            body.items[index]["cost"] = parseInt(cost);
            body.totalCost += parseInt(cost);
            body.totalPages += item.totalPages;
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

  static async list(params, userId, role) {
    try {
      let filters = {};
      if (role == "customer") {
        filters["userId"] = ObjectId(userId);
      } else {
        filters["orderLater"] = false;
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
      let orderToUpdate = await ordersData.findOne({ _id: id });
      if (!orderToUpdate) {
        return common.failureResponse({
          message: "Order to modify was not found!",
          statusCode: httpStatusCode.not_found,
          responseCode: "CLIENT_ERROR",
        });
      }
      let userInfo = await usersData.findOne({ _id: orderToUpdate.createdBy });
      if (!userInfo) {
        return common.failureResponse({
          message: "User to notify was not found!",
          statusCode: httpStatusCode.not_found,
          responseCode: "CLIENT_ERROR",
        });
      }

      let orders = await ordersData.updateOneOrder({ _id: id }, body);

      if (body.status == "accepted") {
        await notifications.sendSms({
          to: userInfo.mobile,
          message: utilsHelper.composeEmailBody(common.ORDER_ACCEPT_MESSAGE, {
            name: userInfo.name,
            orderId: id,
          }),
          template_id: process.env.ORDER_ACCEPTED_TEMPLATE_ID,
        });
      } else if (body.status == "rejected") {
        await notifications.sendSms({
          to: userInfo.mobile,
          message: utilsHelper.composeEmailBody(common.ORDER_REJECT_MESSAGE, {
            name: userInfo.name,
            orderId: id,
          }),
          template_id: process.env.ORDER_REJECTED_TEMPLATE_ID,
        });
      } else if (body.status == "ready") {
        await notifications.sendSms({
          to: userInfo.mobile,
          message: utilsHelper.composeEmailBody(common.ORDER_COMPLETE_MESSAGE, {
            name: userInfo.name,
            orderId: id,
          }),
          template_id: process.env.ORDER_COMPLETE_TEMPLATE_ID,
        });
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
