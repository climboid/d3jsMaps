'use strict';

angular.module('appApp')
.controller('MainCtrl', function ($scope, countrylist, missingCountries, $http) {

	$scope.countries = countrylist;

	$scope.toggleCode = false;
	
	$scope.radioList = [{
		value : '_adm0',
		title : 'country outline',
		desc : 'width 1st level of sub division',
		disabled : false
	},
	{
		value : '_adm1',
		title : 'country outline',
		desc : 'with 2nd level of sub division',
		disabled : false
	},
	{
		value : '_adm2',
		title : 'country outline',
		desc : 'with 2nd level of sub divisions',
		disabled : false
	},
	{
		value : '_adm3',
		title : 'Inland division of country',
		desc : 'counties regions',
		disabled : false
	},
	{
		value : '_water_areas_dcw',
		title : 'inland wter',
		disabled : false
	},
	{
		value : '_roads',
		title : 'roads',
		disabled : false
	},
	{
		value : '_rails',
		title : 'railroads',
		disabled : false
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
	// 			item['missing'] = radio.value
	// 			console.log(item);
	// 		});
	// 	})
	// });

	function getDataFromAmazon(countryObj){
		if ($scope.loading) {
			return;
		}

		$scope.loading = true;
		$scope.toggleCode = false;
		$('svg').remove();
		$http({method: 'GET', url: ('https:' === document.location.protocol ? 'https://' : 'http://') + 'd3automaps-topojson.s3.amazonaws.com/'+countryObj.id+$scope.mapKind+'.json'}).
			success(function(data) {
				$scope.loading = false;
				$scope.mapData = data;
				$scope.toggleCode = $scope.hasUsed = true;
			}).
			error(function() {
				$scope.loading = false;
				$scope.showError = true;
				$scope.toggleCode = false;
				$scope.mapData = [0];
				$scope.errorMsg = 'Sorry, we are still working on that one, try another country';
			});
	}

	function setProjection () {
		if ($scope.countryObj.id === 'USA') {
			$scope.countryProjection = 'd3.geo.albersUsa()';
		} else {
			$scope.countryProjection = 'd3.geo.mercator()';
		}
	}

	function disableMissingMapTypes (country) {
		_.each($scope.radioList, function(radio){
			_.each(country.missing, function(missing){
				if (radio.value === missing) {
					console.log('radio',radio);
					radio.disabled = true;
				}
			});
		});
	}

	function enableRadios () {
		_.each($scope.radioList, function(radio){
			radio.disabled = false;
		})
	}

	$scope.$watch('selectedCountry', function(newValue){
		if (newValue) {
			enableRadios();
			_.each(missingCountries, function(country){
				if (country.value.toLowerCase() === newValue.toLowerCase()) {
					disableMissingMapTypes(country);
				}
			});
		}
	});

	$scope.getCountrySelected = function(){
		$scope.mapData = [];
		$scope.mapOptions = true;
		$scope.countryObj = _.find($scope.countries, function(country){ return country.value === $scope.selectedCountry; });
		$scope.countryObj.id = $scope.countryObj.id.slice(0,3);
		$scope.showError = false;
		setProjection();
		getDataFromAmazon($scope.countryObj);
	};

});
