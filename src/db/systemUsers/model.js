
const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanGetter = require('mongoose-lean-getters')

const userSchema = new Schema({
	email: {
		address: {
			type: String,
			index: {
				unique: true,
			},
			required: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true,
		unique: true,
        index: true
	},
	mobile:{
		type: String,
		required: true
	},
	createdBy: {
		type: ObjectID,
		required: true
	},
	updatedBy: {
		type: ObjectID,
		required: false
	},
	deleted: {
        type: Boolean,
        default:false
    },
	store:Array

})
userSchema.plugin(mongooseLeanGetter)
const SystemUsers = db.model('systemUsers', userSchema, 'systemUsers')

module.exports = SystemUsers
