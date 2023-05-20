
const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongooseLeanGetter = require('mongoose-lean-getters')

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
		type: Object,
		required: true,
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
	},
	feedBack:[{
		rating:{
			type:Number,
			max:5,
			required:[true,'Please provide rating'],
		},
		user:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'users'
		},
		review:{
			type:String,
			trim:true,
		}
	}]
	
})
storeSchema.plugin(mongooseLeanGetter)

const Stores = db.model('stores', storeSchema)

module.exports = Stores
