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
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8013"));

    var contractABI=web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"patients","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPtientsAddress","outputs":[{"name":"addr","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"bytes32"},{"name":"p_address","type":"bytes32"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"bytes32"},{"name":"phnum","type":"bytes32"}],"name":"Register_Patient","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"},{"indexed":false,"name":"desc","type":"bytes32"}],"name":"log","type":"event"}]);
    var contract1 = contractABI.at("0x89f3344387fE66e843b490AFA1c7446f3d6c2A19");
    var coinBalance, etherBalance;
    $scope.patient ={};
    //$scope.timeStamp = new Date($scope.patient.dob);

    /*var name = contract1.getName();
    $scope.patient.name = web3.toAscii(name);*/

    $scope.register = function(){
        var name = web3.toHex($scope.patient.name);
        var address = web3.toHex($scope.patient.address);
        var dob = web3.toHex($scope.patient.dob);
        var bloodgrp = web3.toHex($scope.patient.bloodgrp);
        var mobile = web3.toHex($scope.patient.mobile);
        contract1.Register_Patient.sendTransaction(name, address, dob, bloodgrp, mobile, {from:web3.eth.account[0], gas:210000});
    }
    

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