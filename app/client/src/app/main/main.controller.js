'use strict';

angular.module('client')
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.typeOfMap = 'none';
  	
  	$scope.fetchMap = function () {
  		console.log('in fetch map');
  		console.log('type of map', $scope.typeOfMap);
  		// 45 is the country id
	  	// $http.get('/api/countries/45').
		  // success(function(data, status, headers, config) {
		  //   console.log('data', data);
		  // }).
		  // error(function(data, status, headers, config) {
		    
		  // });
  	};

  });
