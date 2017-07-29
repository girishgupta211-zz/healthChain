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
var adminAddress = "0x93053d64a81a55715287d34cdc2fd04bb4e8bc59";
var patientContractAddress = '0x44b348d94e99e50bea5b0a478099dffa7edc876e';
var web3 = web3_extended.create(options);
/*Admin Contract*/
var adminAbiString = '[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"patients","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"day","type":"uint256"},{"name":"data","type":"string"}],"name":"addRecords","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFirstPatietAddress","outputs":[{"name":"addr","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"name":"registerPatient","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"},{"indexed":false,"name":"desc","type":"string"}],"name":"log","type":"event"}]';
var adminAbi = JSON.parse(adminAbiString);
var adminContract = web3.eth.contract(adminAbi).at(adminAddress);
var patientabi = JSON.parse('[{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"name","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getaddress","outputs":[{"name":"add","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bpm","type":"uint256"},{"name":"bp","type":"uint256"},{"name":"spo2","type":"string"}],"name":"addHealthData","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getbloodgrp","outputs":[{"name":"blood_grp","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdob","outputs":[{"name":"dob","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getphnum","outputs":[{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bpm","type":"uint256"},{"indexed":false,"name":"bp","type":"uint256"},{"indexed":false,"name":"spo2","type":"string"}],"name":"logEvent","type":"event"}]');        


exports.registerPatient = function(req, res){
	var name = (req.body.name);
    var address = (req.body.address);
    var dob = (req.body.dob);
    var bloodGroup = (req.body.bloodGroup);
    var mobileNo = (req.body.mobileNo);
    var from = web3.eth.accounts[0]; //req.body.from;
    var txHash = adminContract.registerPatient.sendTransaction(name, address, dob, bloodGroup, mobileNo, {from:from, gas:697283});        
    var patientAddress = adminContract.getFirstPatietAddress();
    // Save patients to db
    savePatient(txHash,patientAddress,name,address,dob,bloodGroup,mobileNo);
    return res.json({"success":"true",'txHash': txHash, 'patientsAddress':patientAddress});
}

exports.addCareTacker = function(req, res){
    var patientId = req.body.patientId;
    var name = req.body.name;
    var email= req.body.email;
    PatientService.addCareTacker = function(err, resp1){
        if(!err){
            return res.json({"success":"true","message":"Added successfully"});
        }
    }
}

exports.getPatinetDetails = function(req, res){
	var patientId = req.body.patientId;
    // console.log(patientId);

	var patientContract = web3.eth.contract(patientabi).at(patientId);

	var name = patientContract.getName();
    var dob = patientContract.getdob().toNumber();    
    var address = (patientContract.getaddress());
    var bloodGroup = (patientContract.getbloodgrp());
    var mobileNo = patientContract.getphnum();
    // console.log(mobileNo);
    return res.json({"success":"true",'name': name, 'dob':dob, 'address':address , 'bloodGroup':bloodGroup, 'mobileNo':mobileNo });
}

exports.getTransactionReceipt = function(req, res){
	var txHash = req.body.txHash;
    // console.log(txHash);
	var txReceipt = web3.eth.getTransactionReceipt(txHash);
    // console.log(txReceipt)
	var txhash = txReceipt.transactionHash;
    var txIndex = txReceipt.transactionIndex;
    var blockHash = txReceipt.blockHash;
    var blockNumber = txReceipt.blockNumber;
    var gasUsed = txReceipt.gasUsed;
    var cumulativeGasUsed = txReceipt.cumulativeGasUsed;

    return res.json({"success":"true", 'txHash': txHash, 'txIndex':txIndex, 'blockHash': blockHash,  'blockNumber':blockNumber, 'gasUsed':gasUsed, 'cumulativeGasUsed':cumulativeGasUsed });
}

exports.logData = function(req, resp){
	if($scope.startLoggingVar){
        counter++;
        // patient health data log on blockchain. so add patient address here
        adminContract.addRecords.sendTransaction(patientContractAddress,counter, "Hello",{from:web3.eth.accounts[0], gas:2100000});
    }
}

exports.addPrescription = function(req, resp){	
	var patientId = req.body.patientId;
    var prescription = { medicineName : req.body.medicineName , timesADay : req.body.timesADay 
        , fromDate : req.body.fromDate
        , tillDate : req.body.tillDate
        , doctorId : req.body.doctorId 
         };
	// var prescription = req.body.prescription; 
	PatientService.addPrescription(patientId, prescription, function(resp1){
		if(!resp1.error){
            // debugger;
			// console.log("Resp from db : "+JSON.stringify(resp1));
            //create a calander for each prescription
            console.log(prescription);
            for(var i=0; i<prescription.length ; i++){
                var cp = prescription[i];
                // debugger;
                addSchedule(patientId,cp.medicineName,cp.fromDate,cp.tillDate,cp.timesADay);
            }
            // save logs
            addPrescriptionLogs(patientId, prescription);

    		return resp.json({"success":"true","data":"Prescription added successfully"});
    	}
		else{
			console.log("Prescription could  not be saved");		
		}
	})
}

function addSchedule(patientId,medicineName,fromDate,tillDate,timesADay){
    // create calander will take params like id, tillDate, fromdate, medicineName, status
    PatientService.addSchedule(patientId,medicineName,fromDate,tillDate, timesADay,function(resp1){
        console.log(resp1);
        if(!resp1.error){
            console.log("Resp from db : "+JSON.stringify(resp1));
            //create a calander for each prescriptionId
            //return resp.json({"success":"true","data":"Schedule added successfully"});
        }
        else{
            console.log("Schedule could not be saved");     
        }
    });
}

exports.getSchedule = function(req, resp){
    var patientId = req.body.patientId;
    //var patientId = '0x1309d6120d98aaf56913c7ab7b5964a95ecb8697';
    PatientService.getSchedule(patientId, function(resp1){
        if(!resp1.success){
            console.log("Error in getting schedule");
            return res.json({"success":"false","message":"Error in getting schedule"});
        }
        else{
            console.log("succesfully recieved schedule");
            return resp.json({"success":"true","data":[{"result":resp1}]});
        }
    });
}

function addPrescriptionLogs(patientId, prescription){
    PatientService.addPrescriptionLog(patientId, prescription, function(resp1){
        if(!resp1.error)
            return true;
        else
            return false;
    });
}

exports.getPrescriptionLogs = function(req, res){
    var patientId = req.body.patientId;
    PatientService.getPrescriptionLog(patientId, function(resp1){
        if(!resp1.success){
            console.log("Error occured in getting prescription history");
            return res.json({"message":"Error occured in getting prescription history"});
        }
        else{
            console.log("succesfully recieved prescription history");
            return res.json({"result":resp1});
        }
    })
}

exports.updateMedicineTakeStatus = function(req, resp){
    var patientId = req.body.patientId;
    var medicineName = req.body.medicineName;
    var date = req.body.date;
    var time = req.body.time; // 0-morning, 1- afternood, 2- evening/night
    var status = req.body.status; // Taken or skipped
    PatientService.updateMedicineTakeStatus(patientId, medicineName,date, time, status, function(resp1){
        if(!resp1.error)
            //return true;
            return resp.json({"success":"true", 'message':'status upadated sucessfully'});
        else
            return resp.json({"success":"false", 'message':'unable to update status'});
    });

}



exports.getPatients = function(req, res){
    console.log("getting patients");
    var skipRows = req.body.skipRows;
    var limit = req.body.limit;
    PatientService.getPatients(skipRows,limit,function(resp){
        if(!resp.success){
            console.log("Error occured in getting patients");
            return res.json({"success":"false","message":"Error occured in getting patients"});
        }
        else{
            console.log("succesfully recieved patients");
            return res.json({"success":"true","data":[{"result":resp}]});
        }
    })
    /*debugger;
    Transaction.find(function(err,result){
        if(err) console.log("Error in getting transaction: "+err);
        else{
            console.log(JSON.stringify(result));
            return res.json({"success":"true","data":[{"result":result}]});
        }
    })*/
}

exports.countPatients = function (req, res){
    //var status = req.body.status;
    PatientService.countRecords(function(resp){
        if(!resp.success){
            console.log("Error occured in getting count");
            return res.json({"success":"false","data":[{"message":"Error occured in getting count"}]});
        }
        else{
            console.log("Total Patients = "+resp.data);
            return res.json({"success":"true","data":[{"result":resp}]});
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


// save medicieStatus
exports.addMedicineLogs = function(req, resp){
    var patientId = req.body.patientId;
    var medicineName = req.body.medicineName;
    var date = req.body.date;
    var time = req.body.time; //time submiited by end user
    var status = req.body.status; // Taken or skipped
    PatientService.addMedicineLogs(patientId, medicineName,date, time, status, function(resp1){
        if(!resp1.error)
            //return true;
            return resp.json({"success":"true", 'message':'status upadated sucessfully'});
        else
            return resp.json({"success":"false", 'message':'unable to update status'});
    }); 
}