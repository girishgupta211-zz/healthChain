'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Schedules = new Schema({
	patientId : { type : String},
	medicineName: {type: String},
	date : { type : Date},
	time : { type : Number},
	status : { type : String }
})

module.exports = mongoose.model('Schedules', Schedules);