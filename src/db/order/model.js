
const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongooseLeanGetter = require('mongoose-lean-getters')

const orderSchema = new Schema({
    userId: {
        type: ObjectID,
        required: true
    },
    items: [ {
        documents:{
            type:Array,
            required: false
        },
        copies: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        paperSize: {
            type: String,
            required: true,
        },
        paperQuality: {
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
        costPerPage:{
            type: String,
        }
    }],
    storeId: {
        type: ObjectID,
		required: true
    },
    totalPages: {
        type: Number,
        required: false
    },
    totalCost: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: false,
        default: "Pending"
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
orderSchema.plugin(mongooseLeanGetter)

const orders = db.model('orders', orderSchema)

module.exports = orders
