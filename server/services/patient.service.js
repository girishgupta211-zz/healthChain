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
		}, function(err, transaction) {
			console.log("Error : "+err, "Transaction : "+JSON.stringify(transaction));
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

	/* Without pagination*/
	/*_self.getAllTransactions = function(cb){
		Transaction.find(function(err,result){
			if(err) { return cb({"success" : false, message : err}) };
			//return cb({error:false, message: success});
			return cb({"success":"true","data":result});
		});
	}*/

	/*With paginations*/
	/*_self.getAllTransactions = function(skipRows,limit,cb){
		debugger;
		var cursor = Transaction.find();
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}*/

	/* With optional param*/
	/*_self.getAllTransactions = function(skipRows,limit,status,cb){
		var query = status ? {status:status} :{};
		var cursor = Transaction.find(query);
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}

	_self.countTransactions = function(status,cb){
		var query = status ? {status: status}: {};
		Transaction.count(query, function(err, result){
			if(err){
				return cb({success : false, message : "Unable to get Transaction count"});
			}
			else{
				return cb({success : true, data:result});
			}
		});
	}*/
	return {
		"savePatient" : _self.savePatient,
		"addPrescription" : _self.addPrescription		
	}
}

/*exports.getAllTransactions = function(){
	var _self = this;
	_self.

};*/

module.exports = new PatientService();