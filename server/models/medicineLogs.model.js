'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MedicineLogs = new Schema({
	patientId :{type:String, required:true},
    medicineName :{type:String},
    date :{type:Date},
    time :{type:String}, //time submiited by end user
    status :{type:String} // Taken or skipped
})

module.exports = mongoose.model('MedicineLogs', MedicineLogs);