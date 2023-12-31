// Dependencies
const ObjectId = require("mongoose").Types.ObjectId;
const Stores = require("./model");

module.exports = class StoresData {
  static async findOne(filter, projection = {}) {
    try {
      const userData = await Stores.findOne(filter, projection).lean({
        getters: true,
      });
      return userData;
    } catch (error) {
      return error;
    }
  }

  static async findAllStores(filter, projection = {}) {
    try {
      const StoresData = await Stores.find(filter, projection).lean({
        getters: true,
      });
      console.log(StoresData, "StoresData");
      return StoresData;
    } catch (error) {
      return error;
    }
  }

  static async create(data) {
    try {
      let store = await new Stores(data).save();
      return store;
    } catch (error) {
      throw error;
    }
  }

  static async updateOneStore(filter, update, options = {}) {
    try {
      const res = await Stores.updateOne(filter, update, options);
      if (
        (res.n === 1 && res.nModified === 1) ||
        (res.matchedCount === 1 && res.modifiedCount === 1)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  }

  static async listStores(filters, page, limit, search) {
    try {
      filters["deleted"] = false;
      let data = await Stores.aggregate([
        {
          $match: {
            $and: [filters],
            $or: [{ name: new RegExp(search, "i") }],
          },
        },
        {
          $addFields: {
            avgRating: {
              $cond: {
                if: {
                  $and: [
                    {
                      $isArray: "$feedBack",
                    },
                    {
                      $gt: [
                        {
                          $size: "$feedBack",
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: {
                  $divide: [
                    { $sum: "$feedBack.rating" },
                    { $size: "$feedBack" },
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            address: 1,
            location: 1,
            meta: 1,
            updatedAt: 1,
            createdAt: 1,
            updatedBy: 1,
            createdBy: 1,
            feedBack: 1,
            avgRating: 1,
            reviewers: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { refUserId: "$feedBack.user" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $cond: {
                          if: { $isArray: "$$refUserId" },
                          then: "$$refUserId",
                          else: [],
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  refreshTokens: 0,
                },
              },
            ],
            as: "reviewer",
          },
        },
        {
          $sort: { name: 1 },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            data: [{ $skip: limit * (page - 1) }, { $limit: limit }],
          },
        },
        {
          $project: {
            data: 1,
            count: {
              $arrayElemAt: ["$totalCount.count", 0],
            },
          },
        },
      ]).collation({ locale: "en", caseLevel: false });
      console.log("check result ", data);
      return data;
    } catch (error) {
      return error;
    }
  }
  static async pushFeedBack(storeId, feedBack) {
    try {
      const queryRes = await Stores.updateOne(
        { _id: storeId },
        {
          $push: {
            feedBack: feedBack,
          },
        }
      );
      return queryRes;
    } catch (error) {
      return error;
    }
  }
};
//
