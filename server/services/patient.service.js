'use strict'

var Patients = require('./../models/patients.model'),
	mongoose = require('mongoose');


var PatientService = function(){
//exports.TransactionService = function(){
	var _self = this;

	_self.savePatient = function(txId,patientId,name,address,dob,bloodGroup,mobileNo,cb){		
		Patients.create({
			transactionId : txId,
			patientId : patientId,
			name : name,
			address : address,
			dob : dob,
			mobileNo : mobileNo,
			bloodGroup : bloodGroup
		}, function(err, patient) {
			console.log("Error : "+err, "Patient : "+JSON.stringify(patient));
			if(err) { return cb({error : true, message : err}) };
			return cb({error : false, message : "Patient Added Successfully"});
		});
	}

	_self.addPrescription = function(patientId, prescription,cb){
		Patients.update({patientId:patientId}, {prescription:prescription}, function(err, resp){
			if(err)
				return cb({error : true, message : err}) 
			else
				cb({error : false, message : "Prescription added for user"});
		})
	}


	/*With paginations*/
	_self.getPatients = function(skipRows,limit,cb){		
		var cursor = Patients.find();
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}

	/* With optional param*/
	/*_self.getAllTransactions = function(skipRows,limit,status,cb){
		var query = status ? {status:status} :{};
		var cursor = Transaction.find(query);
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}*/

	_self.countRecords = function(cb){		
		Patients.count({}, function(err, result){
			if(err){
				return cb({success : false, message : "Unable to get Transaction count"});
			}
			else{
				return cb({success : true, data:result});
			}
		});
	}
	return {
		"savePatient" : _self.savePatient,
		"addPrescription" : _self.addPrescription,
		"getPatients" : _self.getPatients,
		"countRecords" : _self.countRecords
	}
}

/*exports.getAllTransactions = function(){
	var _self = this;
	_self.

};*/

module.exports = new PatientService();