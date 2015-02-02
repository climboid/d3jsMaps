'use strict';

angular.module('client')
  .controller('AutoSuggestCtrl', function ($scope, countryList, $http) {

  	var selectedMap = null;

  	$scope.suggestList = [];
   
    $scope.$watch('cName', function(next_val, prev_val) {
    	if (!next_val || next_val.length < 3) return;

    	var arr = [];

    	_.each(countryList, function(item) {
    		var countryName = item.value.toLowerCase();
    		var toMatchName = next_val.toLowerCase();
    		var res = countryName.match(new RegExp(toMatchName,'g'));
    		if (res) arr.push(item);
    	});

    	$scope.suggestList = arr;

    });

    $scope.selSuggestedValue = function (item) {
    	var index = item.id.indexOf('_');
  		$scope.cName = item.value;
  		selectedMap = item.id.slice(0,index);
  	};

    $scope.fetchMap = function () {
    	var endURL = selectedMap + '_' + $scope.typeOfMap;
    	
	  	$http.get('/api/countries/' + endURL).
		  success(function(data, status, headers, config) {
		    console.log('data', data);
		  }).
		  error(function(data, status, headers, config) {
		    
		  });
  	};
  });
