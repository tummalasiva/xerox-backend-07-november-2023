
const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongooseLeanGetter = require('mongoose-lean-getters')

const permissionsSchema = new Schema({
	role: {
		type: String,
		required: true,
		unique: true,
	},
    permissions: {
        type: Object,
    },
	status: {
		type: String
	},
	meta: {
			type: Object,
			required: false,
	},
    deleted: {
        type: Boolean,
        default:false
    },
	createdBy: {
		type: ObjectID,
		required: true
	},
	updatedBy: {
		type: ObjectID,
		required: false
	}
	
})
permissionsSchema.plugin(mongooseLeanGetter)

const Stationary = db.model('permission', permissionsSchema)

module.exports = Stationary
