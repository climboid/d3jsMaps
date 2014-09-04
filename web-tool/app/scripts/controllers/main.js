'use strict';

angular.module('appApp')
.controller('MainCtrl', function ($scope, countrylist, $http) {

	$scope.countries = countrylist;

	//
	// not all countries have the missing properties from DIVA, need to make a new script
	// to not fail on 404 and continue fetching in order to update the missing files
	// 
	
	$scope.radioList = [{
		value : '_adm0',
		title : 'country outline',
		desc : 'width 1st level of sub division'
	},
	{
		value : '_adm1',
		title : 'country outline',
		desc : 'with 2nd level of sub division'
	},
	{
		value : '_adm2',
		title : 'country outline',
		desc : 'with 2nd level of sub divisions'
	},
	{
		value : '_adm3',
		title : 'Inland division of country',
		desc : 'counties regions'
	},
	{
		value : '_water_areas_dcw',
		title : 'inland wter'
	},
	{
		value : '_roads',
		title : 'roads'
	},
	{
		value : '_rails',
		title : 'railroads'
	}];


	//
	// KEEP THE BELOW FUNCTION
	///
	// It allows for easy finding of what countries we don't have in order to 
	// find them from a different data source or, re-download them
	//
	// _.each(countrylist, function(item){
	// 	var id = item.id.slice(0,3);
	// 	_.each($scope.radioList, function(radio){
	// 		$http({method: 'GET', url: ('https:' === document.location.protocol ? 'https://' : 'http://') + 'd3automaps-topojson.s3.amazonaws.com/'+id+radio.value+'.json'}).
	// 		success(function(data, status, headers, config) {
	// 		}).
	// 		error(function(data, status, headers, config) {
	// 			console.log(item, radio.value);
	// 		});
	// 	})

	// })


	function getDataFromAmazon(countryObj){
		if ($scope.fetching) return;
		
		$scope.loading = $scope.fetching = true;
		$http({method: 'GET', url: ('https:' === document.location.protocol ? 'https://' : 'http://') + 'd3automaps-topojson.s3.amazonaws.com/'+countryObj.id+$scope.mapKind+'.json'}).
			success(function(data, status, headers, config) {
				$scope.loading = $scope.fetching = false;
				$scope.mapData = data;
			}).
			error(function(data, status, headers, config) {
				$scope.loading = false;
				$scope.fetching = false;
				$scope.showError = true;
				$scope.mapData = [0];
				$scope.errorMsg = 'Sorry, we are still working on that one, try another country';
			});
	}

	$scope.getCountrySelected = function(){
		$scope.mapOptions = true;
		$scope.countryObj = _.find($scope.countries, function(country){ return country.value === $scope.selectedCountry; });
		$scope.countryObj.id = $scope.countryObj.id.slice(0,3);
		$scope.showError = false;
		getDataFromAmazon($scope.countryObj);
	};

});
