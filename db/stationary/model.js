const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseLeanGetter = require("mongoose-lean-getters");

const stationarySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  entityId: {
    type: ObjectID,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
  },
  meta: {
    type: Object,
    required: false,
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
});
stationarySchema.plugin(mongooseLeanGetter);

const Stationary = db.model("stationarys", stationarySchema);

module.exports = Stationary;
