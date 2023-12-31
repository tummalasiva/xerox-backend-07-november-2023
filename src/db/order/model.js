const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseLeanGetter = require("mongoose-lean-getters");

const orderSchema = new Schema({
  userId: {
    type: ObjectID,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  items: [
    {
      documents: {
        type: Array,
        required: false,
      },
      copies: {
        type: Number,
        required: true,
      },
      colors: [
        {
          color: {
            type: String,
            required: true,
          },
        },
      ],
      bondPage: {
        selected: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: function () {
            return this.bondPage.description === true ? true : false;
          },
        },
        total: Number,
      },

      colorPar: {
        description: {
          type: String,
        },
        total: Number,
      },
      totalPages: {
        type: Number,
        // required: true,
      },
      paperSize: {
        type: String,
        required: true,
      },
      paperQuality: {
        type: String,
        required: true,
      },
      printLayout: {
        type: String,
        required: true,
      },
      binding: {
        type: String,
        required: false,
      },
      instructions: {
        type: String,
        required: false,
      },
      costPerPage: {
        type: String,
      },
      totalPages: {
        type: Number,
        required: true,
      },
      cost: {
        type: String,
        required: true,
      },
    },
  ],
  storeId: {
    type: ObjectID,
    required: true,
  },
  totalPages: {
    type: Number,
    required: false,
  },
  totalCost: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: "Pending",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: ObjectID,
    required: true,
  },
  updatedBy: {
    type: ObjectID,
    required: false,
  },
  paidAt: {
    type: Date,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: String,
  },
  feedBack: {
    rating: {
      type: Number,
      max: 5,
      //   required: [true, "Please provide rating"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    review: {
      type: String,
      trim: true,
    },
  },
});
orderSchema.plugin(mongooseLeanGetter);

const orders = db.model("orders", orderSchema);

module.exports = orders;
