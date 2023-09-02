/**
 * name : db/userentities/model
 * author : Aman Gupta
 * Date : 04-Nov-2021
 * Description : User Entity schema
 */

// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const mongooseLeanGetter = require("mongoose-lean-getters");

const userEntitySchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "ACTIVE",
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  store: Array,
  image: {
    type: String,
  },
});
userEntitySchema.plugin(mongooseLeanGetter);
const UserEntities = db.model("userEntities", userEntitySchema, "userEntities");

module.exports = UserEntities;
