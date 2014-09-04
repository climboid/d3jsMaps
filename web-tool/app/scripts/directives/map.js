'use strict';

angular.module('appApp').directive('map', function () {
	return {
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			scope.$watch('mapData', function() {
				if(scope.mapData){
					$(element[0]).empty();
					var width = $(element[0]).parent().width(),
					height = 384;

					var projection = scope.selectedCountry === 'United States' ? d3.geo.albersUsa() : d3.geo.mercator();

					var path = d3.geo.path()
					.projection(projection);

					var svg = d3.select(element[0]).append('svg')
					.attr('width', width)
					.attr('height', height);

					
					var typeOfMap = scope.countryObj.id + scope.mapKind;
					var country = scope.mapData;

					
					if (country.objects) {
						var selectedCountry = topojson.feature(country, country.objects[typeOfMap]);

						projection.scale(1).translate([0,0]);

						var b = path.bounds(selectedCountry),
						s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
						t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

						projection.scale(s).translate(t);

						var features = topojson.feature(country, country.objects[typeOfMap]).features;
						svg.append('g')
							.attr('class', 'boundary')
							.selectAll('path')
							.data(features)
							.enter().append('path')
							.attr('d', path);	
					}
					

				}
			});
		}
	};
});
