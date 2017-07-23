'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Patients = new Schema({
	transactionId : { type : String, required : true},
	patientId : { type : String},
	name : { type : String ,required : true},
	address : { type : String ,required : true},
	dob : { type : String ,required : true},
	mobileNo : { type : String ,required : true},
	bloodGroup : { type : String ,required : true},
	prescription: [{
		medicineName: String,
		timesADay : Number,
		fromDate: Date,
		tillDate: Date,
		doctorId: String
	}]
})

module.exports = mongoose.model('Patients', Patients);