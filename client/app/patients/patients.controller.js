'use strict';

angular.module('myApp.patients', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/patients', {
    templateUrl: 'patients/patients.html',
    controller: 'patientsCtrl'
  });
}])

.controller('patientsCtrl', ['$scope','$http', '$uibModal', '$uibModalStack', function($scope, $http, $uibModal, $uibModalStack) {
	var config = {
            headers: {'Content-Type': 'application/json'}     
        };
    //get data from mongo db and display here	
    $scope.currentPage = 1;  
	$scope.getPatients = function(req, res){
        var y = $scope.totalPatients();		
        // '_skipRows': (($scope.currentPage-1)*5),
        var data = {           
            'skipRows' : (($scope.currentPage-1)*5),
            'limit' : 5,
            'status' : $scope.status
        }
        $http.post('http://localhost:7000/eth/getPatients',data,config)
        	.then(function successcallback(resp){                
        		console.log(resp);
        		$scope.patients = resp.data.data[0].result.data;
        		console.log($scope.patients);
        	},
        	function errorcallback(resp){
        		console.log("Error in getiing data from server: "+JSON.stringify(resp));
        	});
	};

    $scope.totalPatients = function(req, resp) {
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }     
        };
        var data = {
            'status': $scope.status
        };
        $http.post('http://localhost:7000/eth/countPatients',data, config)
            .then(function successcallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionCount = resp.data.data[0].result.data;
                    console.log($scope.transactionCount);
                }
                else{
                    console.log(resp.data.message);
                }                
            },
            function errorcallback(resp){
                console.log("Error in getiing data from server: "+JSON.stringify(resp));
            });
    }

    $scope.pageChanged = function(){
        console.log("Page clicked: "+$scope.currentPage);
        var z = $scope.getPatients();
    }

	var x= $scope.getPatients();
}]);