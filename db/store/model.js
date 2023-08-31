const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseLeanGetter = require("mongoose-lean-getters");

const locationSchema = new Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const storeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  meta: {
    type: Object,
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  openingTime: {
    type: String,
    required: true,
  },

  closingTime: {
    type: String,
    required: true,
  },
  createdBy: {
    type: ObjectID,
    required: true,
  },
  updatedBy: {
    type: ObjectID,
    required: false,
  },
  feedBack: {
    type: [
      {
        rating: {
          type: Number,
          max: 5,
          required: [true, "Please provide rating"],
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
    ],
    default: null,
  },
});
storeSchema.plugin(mongooseLeanGetter);

const Stores = db.model("stores", storeSchema);

module.exports = Stores;
