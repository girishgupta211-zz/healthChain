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

    $scope.register = function(){
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
    }

    $scope.getPatientDetails = function(id){
        var patientContract = web3.eth.contract(patientabi).at(id);
        $scope.patient.name1 = patientContract.getName();
        $scope.patient.dob1 = patientContract.getdob().toNumber();
        //$scope.patient.dob1 = web3.toAscii(patientContract.getdob());
        $scope.patient.address1 = (patientContract.getaddress());
        $scope.patient.bloodGroup1 = (patientContract.getbloodgrp());
        $scope.patient.mobileNo1 = patientContract.getphnum();
    }
    
    $scope.getFirstPatietAddress = function(index){
        $scope.paddr = adminContract.patientsAddr(index);
        console.log($scope.paddr);
    }

    $scope.transaction={};
    $scope.getTransactionReceipt = function(txhash){
        var s = web3.eth.getTransactionReceipt(txhash);
        console.log(s);
        $scope.transaction.txhash = s.transactionHash;
        $scope.transaction.txIndex = s.transactionIndex;
        $scope.transaction.blockHash = s.blockHash;
        $scope.transaction.blockNumber = s.blockNumber;
        $scope.transaction.gasUsed = s.gasUsed;
        $scope.transaction.cumulativeGasUsed = s.cumulativeGasUsed;
        $scope.transaction.data = s.logs.data;        
    }

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
    /*patientEvent.watch(function(error, event){
      if (!error)
        console.log(event);
        //addEvent(event);
    });*/



	//var x=watchTransaction();

/*    $scope.testEstimateGas = function(){
        var config = {
            headers: {               
                'Content-Type': 'application/json'
            }
        };
        var data = {};
        $http.post('http://localhost:7000/eth/testEstimateGas', data,config)
            .then(function successCallback(resp){
                    console.log(resp.data);                    
                    }, 
                function failureCallback(){
                    console.log('failure');
                });    
    }

    //check Ether Balance - done
    $scope.showBalance = false;
    $scope.checkEtherBalance = function(accountAddr){
        if(!isAddress(accountAddr)){
            $scope.error = "Account address is not valid";
            $scope.openErrorPopup();
        }
        var data = JSON.stringify({accountAddress:accountAddr});
        var config = {
            headers: {               
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/checkEthBalance', data,config)
            .then(function successCallback(resp){
                    console.log(resp.data);
                    if(resp.data.success== 'true'){
                        console.log(resp.data.data[0].balance);
                        $scope.etherBalance = resp.data.data[0].balance;
                        $scope.showBalance = true;
                        $timeout(function(){
                            $scope.showBalance = false;
                        }, 4000);
                        console.log('x');
                        $scope.x.$setPristine();
                        }
                    }, 
                function failureCallback(){
                    console.log('failure');
                });           
    }

    $scope.checkCoinBalance = function(accountAddr){    
        console.log('Check coin balance');   
        var data = JSON.stringify({accountAddress:accountAddr});
        var config = {
            headers: {               
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/checkCoinBalance', data,config)
            .then(function successCallback(resp){
                    console.log(resp.data);
                    if(resp.data.success== 'true'){
                        console.log(resp.data.data[0].balance);
                        $scope.coinBalance = resp.data.data[0].balance;
                        $scope.showBalance = true;
                        $timeout(function(){
                            $scope.showBalance = false;
                        }, 4000);
                        }
                    }, 
                function failureCallback(){
                    console.log('failure');
                });           
    }

    // watch balance - pending
    function watchBalance(accountAddr) {
        alert("clicked");
       var etherBalance , coinBalance; 
	   etherBalance=web3.eth.getBalance(accountAddr).toNumber(); 
	   coinBalance=contract1.balanceOf(accountAddr); 			
        web3.eth.filter('latest').watch(function() {
         	etherBalance=web3.eth.getBalance(accountAddr).toNumber(); 
        		coinBalance=contract1.balanceOf(accountAddr);
            });
    }

    //transfer Coin - done 
    $scope.transferCoin = function(to, amount,from, passphrase){
        var data = JSON.stringify({
            senderAddress: from,
            recipientAddress: to,
            amount: amount,
            passphrase:passphrase
        });
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/transferCoin', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionHash = resp.data.data[0].transactionHash;
                    alert('Transaction send successfully. Tx hash = '+$scope.transactionHash);
                }
                else{
                    alert('Error: '+resp.data.data[0].message);
                }            
                $scope.transfer = {};
                $scope.transferForm.$setUntouched();
                $scope.transferForm.$setPristine();
                $scope.closeAllPopup();             
                }, function errorCallback(resp){
                    console.log(resp);
                });    	
    }
    
	//Mint Token -- pending
    $scope.mintToken = function(to,amount,passphrase){
        console.log('Mint token from client');
        var data = JSON.stringify({
            toAddress: to,
            mintAmount: amount,
            passphrase: passphrase
        });
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/mintCoin', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionHash = resp.data.data[0].transactionHash;
                    alert('Transaction send successfully. Tx hash = '+$scope.transactionHash);
                    $scope.closeAllPopup();
                    $scope.mint={};
                    $scope.mintForm.setPristine();
                }                
                else{
                    alert('Error: '+resp.data.data[0].message);
                }             
            }, function errorCallback(resp){
                console.log('error');
            });         
    }

	//Set Prices
    $scope.setPrices = function(newSp, newBp, passphrase){
        var data = JSON.stringify({
            sellPrice : newSp,
            buyPrice : newBp,
            passphrase : passphrase
        });
        var config = {
            headers:{
                'Content-Type' : 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/setPrices',data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionHash = resp.data.data[0].transactionHash;            
                    alert('Transaction send successfully. Tx hash = '+$scope.transactionHash); 
                }                
                else{
                    alert('Error: '+resp.data.data[0].message);
                }                   
            },
            function errorCallback(err){
                console.log("Error in getting data from server :"+JSON.stringify(err));
            });
    }

	//Sell coin
    $scope.sell = function(frm,amount,passphrase){
        var data= JSON.stringify({
            from : frm,
            amount : amount,
            passphrase : passphrase
        }); 
        var config = {
            headers:{
                'Content-Type' : 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/sellCoin',data, config)
            .then(function successCallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionHash = resp.data.data[0].transactionHash; 
                    alert('Transaction send successfully. Tx hash = '+$scope.transactionHash);
                }                
                else{
                    alert('Error: '+resp.data.data[0].message);
                }                    
            },
            function errorCallback(err){
                console.log("Error in getting data from server :"+JSON.stringify(err));
            }); 
    }

	//buy coin
    $scope.buy = function(frm,ether,passphrase){
    	var data= JSON.stringify({
            from : frm,
            ether : ether,
            passphrase : passphrase
        }); 
        var config = {
            headers:{
                'Content-Type' : 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/buyCoin',data, config)
            .then(function successCallback(resp){        
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionHash = resp.data.data[0].transactionHash; 
                    alert('Transaction send successfully. Tx hash = '+$scope.transactionHash);
                }                
                else{
                    alert('Error: '+resp.data.data[0].message);
                }   
            },
            function errorCallback(err){
                console.log("Error in getting data from server :"+JSON.stringify(err));
            }); 
    }

	//create new account
    $scope.showAccountAddr = false;
    $scope.createAccount = function (password){
        var data = JSON.stringify({passphrase:password});
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/createNewAccount', data, config)
            .then(function successCallback(resp){
                 console.log(resp);
                if(resp.data.success){
                    $scope.accountAddress = resp.data.data[0].accountAddress;
                    $scope.showAccountAddr = true;
                }                
                else{
                    alert('Error: '+resp.data.data[0].message);
                }   
                $timeout(function(){
                    $scope.showAccountAddr = false;
                }, 3000);

                }, function errorCallback(resp){
                    console.log('error');
                });    	
    }

    //Popup
     $scope.openBalancePopup= function(){
        $uibModal.open({
            templateUrl: 'assets/models/popUp1.html',
            size: 'md',
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'zindex'
          });
        }

     $scope.openMintPopup = function(){
        $uibModal.open({
            templateUrl: 'assets/models/mintPopup.html',
            size: 'md',
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'zindex'
          });
        }

     $scope.openTransferCoinPopUp = function(){
        $uibModal.open({
            templateUrl: 'assets/models/transferCoinPopup.html',
            size: 'md',
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'zindex'
          });
        }

     $scope.openErrorPopup = function(){
        $uibModal.open({
            templateUrl: 'assets/models/errorPopup.html',
            size: 'md',
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'zindex'
          });
     }


    $scope.closeAllPopup = function(){
        $uibModalStack.dismissAll();
    }


    // Validate account addeesses
    var isAddress = function (address) {
        // function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false;
        } 
        else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return "true
            return true;
        } 
        else {
            // Otherwise check each case
            return isChecksumAddress(address);
        }
    }

    var isChecksumAddress = function (address) {
        // Check each case
        address = address.replace('0x','');
        var addressHash = web3.sha3(address.toLowerCase());
        for (var i = 0; i < 40; i++ ) {
            // the nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    }


   var arr=[];
	 function watchTransaction(tx){
	 		
	 	contract1.Transfer(function(error,result){
	 		if(!error){	
	 			//storeTransactionHash(result.transactionHash);
				if(result.transactionHash==tx)           // to display only the transactions that are copmming through this web interface
					alert("successful");
					//console.log("Coin transfer: " + result.args.amount + " tokens were sent. Balances now are as following: \n Sender:\t" + result.args.sender);				
	 		}
	 		else{
	 			alert("transaction failed");
	 		}
	 	})
	 }


 	/*function storeTransactionHash(transHash){
 			arr.push(transHash);

 			alert("Transaction successfull.. trasnsaction hash= "+transHash);
			getTransactions();
		
 	} */

 	/*function getTransactions(){
 		console.log("Without duplicate:"+arr);
 		//arr1=jQuery.unique(arr);
 		document.getElementById('txhash1').innerText="array  is "+ arr ;
 	}*/
});