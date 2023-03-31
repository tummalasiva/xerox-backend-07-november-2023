
const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongooseLeanGetter = require('mongoose-lean-getters')

const stationarySchema = new Schema({
	orderId: {
		type: String,
		required: true,
	},
    paymentId: {
		type: String,
		required: true,
		unique: true,
	},
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: ObjectID,
        required: true
    },
	entity: {
		type: String
	},
    currency: {
        type: String
    },
    receipt: {
        type: String
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
    }
	
})
stationarySchema.plugin(mongooseLeanGetter)

const Stationary = db.model('payments', stationarySchema)

module.exports = Stationary
