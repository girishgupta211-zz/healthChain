'use strict'
var web3_extended = require('web3_extended');
var path = require('path');
var absolutePath =  path.relative('./','/home/gemini/.ethereum/geth.ipc');
var PatientService = require('./../services/patient.service');
var options = {
  //host : absolutePath,	
  host: ' http://localhost:8545',
  ipc : false,
  personal: true, 
  admin: false,
  debug: false
};

var web3 = web3_extended.create(options);
/*Admin Contract*/
var adminAbiString = '[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"patients","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"day","type":"uint256"},{"name":"data","type":"string"}],"name":"addRecords","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFirstPatietAddress","outputs":[{"name":"addr","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"name":"registerPatient","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"},{"indexed":false,"name":"desc","type":"string"}],"name":"log","type":"event"}]';
var adminAbi = JSON.parse(adminAbiString);
var adminContract = web3.eth.contract(adminAbi).at("0x4b058e018fbbc314162069b9ffc8272014456420");
var patientabi = JSON.parse('[{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"name","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getaddress","outputs":[{"name":"add","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bpm","type":"uint256"},{"name":"bp","type":"uint256"},{"name":"spo2","type":"string"}],"name":"addHealthData","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getbloodgrp","outputs":[{"name":"blood_grp","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdob","outputs":[{"name":"dob","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getphnum","outputs":[{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bpm","type":"uint256"},{"indexed":false,"name":"bp","type":"uint256"},{"indexed":false,"name":"spo2","type":"string"}],"name":"logEvent","type":"event"}]');        


exports.registerPatient = function(req, res){
	var name = (req.body.name);
    var address = (req.body.address);
    var dob = (req.body.dob);
    var bloodGroup = (req.body.bloodGroup);
    var mobileNo = (req.body.mobileNo);
    var from = req.body.from;
    var txHash = adminContract.registerPatient.sendTransaction(name, address, dob, bloodGroup, mobileNo, {from:from, gas:697283});        
    var patientAddress = adminContract.getFirstPatietAddress();
    // Save patients to db
    savePatient(txHash,patientAddress,name,address,dob,bloodGroup,mobileNo);
    return res.json({"success":"true","data":{'txHash': txHash, 'patientsAddress':patientAddress}});
}

exports.getPatinetDetails = function(req, res){
	var patientId = req.body.patientId;
	var patientContract = web3.eth.contract(patientabi).at(patientId);
	var name = patientContract.getName();
    var dob = patientContract.getdob().toNumber();    
    var address = (patientContract.getaddress());
    var bloodGroup = (patientContract.getbloodgrp());
    var mobileNo = patientContract.getphnum();
    return res.json({"success":"true","data":{'name': name, 'dob':dob, 'address':address , 'bloodGroup':bloodGroup, 'mobileNo':mobileNo}});
}

exports.getTransactionReceipt = function(req, res){
	var txHash = req.body.txHash;
	var txReceipt = web3.eth.getTransactionReceipt(txhash);
	var txhash = txReceipt.transactionHash;
    var txIndex = txReceipt.transactionIndex;
    var blockHash = txReceipt.blockHash;
    var blockNumber = txReceipt.blockNumber;
    var gasUsed = txReceipt.gasUsed;
    var cumulativeGasUsed = txReceipt.cumulativeGasUsed;
    return res.json({"success":"true","data":{'txHash': txHash, 'txIndex':txIndex, 'blockHash': blockHash,  'blockNumber':blockNumber, 'gasUsed':gasUsed, 'cumulativeGasUsed':cumulativeGasUsed}});      
}

exports.logData = function(req, resp){
	if($scope.startLoggingVar){
        counter++;
        adminContract.addRecords.sendTransaction('0xc5f74b4d70f401043376aaa1b8c2edde32848deb',counter, "Hello",{from:web3.eth.accounts[0], gas:2100000});
    }
}


exports.addPrescription = function(req, resp){
	debugger;
	var patientId = req.body.patientId;
	var prescription = req.body.prescription;
	PatientService.addPrescription(patientId, prescription, function(resp){
		if(!resp.error){
			console.log("Resp from db : "+JSON.stringify(resp));
    		return res.json({"success":"true","data":"Prescription added successfully"});
    	}
		else{
			console.log("Prescription could not be saved");		
		}
	})

}

// saving transaction details to database.
function savePatient(txId,patientId,name,address,dob,bloodGroup,mobileNo){
	PatientService.savePatient(txId,patientId,name,address,dob,bloodGroup,mobileNo, function(resp){
		if(!resp.error){
			console.log("Resp from db : "+JSON.stringify(resp));
		}
		else{
			console.log("Patient could not be saved");		
		}
	});
} // save Patient ends here



