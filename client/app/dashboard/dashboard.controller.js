'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  });
}])

.controller('dashboardCtrl',function($scope, $http, $timeout,$uibModal, $uibModalStack, uibDateParser) {
	//var Web3 = require('web3');
	var web3 = new Web3();
    //web3.setProvider(new web3.providers.HttpProvider("http://localhost:8013"));
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

    var adminAbiString = '[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"patients","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"day","type":"uint256"},{"name":"data","type":"string"}],"name":"addRecords","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFirstPatietAddress","outputs":[{"name":"addr","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"name":"registerPatient","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"},{"indexed":false,"name":"desc","type":"string"}],"name":"log","type":"event"}]';
    var adminAbi = JSON.parse(adminAbiString);
    var adminContract = web3.eth.contract(adminAbi).at("0xa9f93318708a590eedb5977a69676a7334a79645");
    
    // Patient contact details
    var patientabi = JSON.parse('[{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"name","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getaddress","outputs":[{"name":"add","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bpm","type":"uint256"},{"name":"bp","type":"uint256"},{"name":"spo2","type":"string"}],"name":"addHealthData","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getbloodgrp","outputs":[{"name":"blood_grp","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdob","outputs":[{"name":"dob","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getphnum","outputs":[{"name":"phnum","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"p_address","type":"string"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"string"},{"name":"phnum","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bpm","type":"uint256"},{"indexed":false,"name":"bp","type":"uint256"},{"indexed":false,"name":"spo2","type":"string"}],"name":"logEvent","type":"event"}]');
    //$scope.timeStamp = new Date($scope.patient.dob);

    /*var name = adminContract.getName();
    $scope.patient.name = web3.toAscii(name);*/

    /*$scope.register = function(){
        var name = ($scope.patient.name);
        var address = ($scope.patient.address);
        var dob = ($scope.patient.dob);
        var bloodgrp = ($scope.patient.bloodgrp);
        var mobile = ($scope.patient.mobile);
        // Need to unlock the account before send Transaction. This is hard coaded for now.
        //web3.personal.unlockAccount(web3.eth.accounts[0],'password');
        var tx = adminContract.registerPatient.sendTransaction(name, address, dob, bloodgrp, mobile, {from:web3.eth.accounts[0], gas:697283});        
        console.log(tx);

        $scope.currentPatintAddress= adminContract.getFirstPatietAddress();
        alert($scope.currentPatintAddress);
    }*/

    /*$scope.getPatientDetails = function(id){
        var patientContract = web3.eth.contract(patientabi).at(id);
        $scope.patient.name1 = patientContract.getName();
        $scope.patient.dob1 = patientContract.getdob().toNumber();
        //$scope.patient.dob1 = web3.toAscii(patientContract.getdob());
        $scope.patient.address1 = (patientContract.getaddress());
        $scope.patient.bloodGroup1 = (patientContract.getbloodgrp());
        $scope.patient.mobileNo1 = patientContract.getphnum();
    }*/
    
    $scope.getFirstPatietAddress = function(index){
        $scope.paddr = adminContract.patientsAddr(index);
        console.log($scope.paddr);
    }

    /*$scope.transaction={};*/
   /* $scope.getTransactionReceipt = function(txhash){
        var s = web3.eth.getTransactionReceipt(txhash);
        console.log(s);
        $scope.transaction.txhash = s.transactionHash;
        $scope.transaction.txIndex = s.transactionIndex;
        $scope.transaction.blockHash = s.blockHash;
        $scope.transaction.blockNumber = s.blockNumber;
        $scope.transaction.gasUsed = s.gasUsed;
        $scope.transaction.cumulativeGasUsed = s.cumulativeGasUsed;
        $scope.transaction.data = s.logs.data;        
    }*/

    $scope.startLoggingVar = false;
    $scope.startLogging = function(){
        alert('Start Logging events');
        $scope.startLoggingVar = true;
    }

    $scope.stopLogging = function(){
        alert('Stop Logging events');
        $scope.startLoggingVar = true;
    }

    var counter = 0;
    function logData(){
        if($scope.startLoggingVar){
            counter++;
            adminContract.addRecords.sendTransaction('0xc5f74b4d70f401043376aaa1b8c2edde32848deb',counter, "Hello",{from:web3.eth.accounts[0], gas:2100000});
        }
    }
    var interval = setInterval(logData, 13000);

    // define events object for all contract events
    var adminEvent = adminContract.log();
    //var patientEvent = patientContract.allEvents();

    // watch for events
    adminEvent.watch(function(error, event){
      if (!error)
        console.log(event);
        //addEvent(event);
    });


    /*From APi*/
    var config = { headers: {'Content-Type': 'application/json'}};
    $scope.register = function(name,mobileNo,dob,bloodGroup,address){
        var from= web3.eth.accounts[0];
       var data = JSON.stringify({
            name: name,
            mobileNo: mobileNo,
            dob:dob,
            bloodGroup: bloodGroup,
            address: address,
            from: from

       });   
       $http.post('http://localhost:7000/eth/registerPatient', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    var txHash = resp.data.data.txHash;
                    var patientAddress = resp.data.data.patientsAddress;
                    alert('patient Id = '+patientAddress);
                }
                else{
                    alert('Error: '+resp.data.data.message);
                }                                      
                }, function errorCallback(resp){
                    console.log(resp);
       });     
    }

    $scope.getPatientDetails = function(id){
        var data = JSON.stringify({
            patientId: id
       });   
       $http.post('http://localhost:7000/eth/getPatinetDetails', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.patient.name1 = resp.data.data.name;
                    $scope.patient.dob1 = resp.data.data.dob;
                    $scope.patient.address1 = resp.data.data.address;
                    $scope.patient.bloodGroup1 = resp.data.data.bloodGroup;
                    $scope.patient.mobileNo1 = resp.data.data.mobileNo;
                }
                else{
                    alert('Error: '+resp.data.data.message);
                }                                      
                }, function errorCallback(resp){
                    console.log(resp);
        });      
    }

    $scope.transaction={};
    $scope.medicine={};
    $scope.getTransactionReceipt = function(txhash){
        var data = JSON.stringify({
           txHash: txHash
        });   
        $http.post('http://localhost:7000/eth/getTransactionReceipt', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    var respData = resp.data.data;
                    $scope.transaction.txhash = respData.transactionHash;
                    $scope.transaction.txIndex = respData.transactionIndex;
                    $scope.transaction.blockHash = respData.blockHash;
                    $scope.transaction.blockNumber = respData.blockNumber;
                    $scope.transaction.gasUsed = respData.gasUsed;
                    $scope.transaction.cumulativeGasUsed = respData.cumulativeGasUsed;
                    $scope.transaction.data = respData.logs.data; 
                }
                else{
                    alert('Error: '+resp.data.data.message);
                }                                      
                }, function errorCallback(resp){
                    console.log(resp);
        });
        }

    $scope.prescription = [];
    $scope.addPrescription = function(name,timesADay,fromDate,tillDate,doctorId){
        var currentPrecription = {name:name, timesADay: timesADay, fromdate: fromDate, tillDate: tillDate, doctorId: doctorId};
        //$scope.prescription.push(currentPrecription);
        $scope.prescription.push(currentPrecription);
        console.log(typeof($scope.prescription));
    }

    $scope.submitPrescription = function(patientId){
        console.log($scope.prescription);
        var data = {
            'patientId': patientId,
            'prescription': $scope.prescription
        }
        console.log(data);
        //$scope.precription = [];
        $http.post('http://localhost:7000/eth/addPrescription', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    console.log("Prescription added successfully");
                }
                else{
                    alert('Error: '+resp.data.data.message);
                }                                      
                }, function errorCallback(resp){
                    console.log(resp);
       });
    }
}); // controller ends here