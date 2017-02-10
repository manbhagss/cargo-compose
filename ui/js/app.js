var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngSanitize']);

app.config(function ($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(false);
	var routes = [
		{
			location: '/',
			template: 'start.html'
		},
		{
			location: '/history',
			template: 'history.html'
		},
		{
			location: '/error',
			template: 'error.html'
		}
	];

	for (var i = 0; i < routes.length; i++) {
		var currentRoute = routes[i];

		$routeProvider.when(currentRoute.location, {
			templateUrl: 'partials/' + currentRoute.template
		});
	}

	$routeProvider.otherwise({redirectTo: '/error'});
});

app.run(function ($rootScope) {
	$rootScope.results = [];
});

app.factory('ServiceService', function ($http) {
	return {
		executeCommand: function (command, serviceName) {
			return $http.post(command + '/' + serviceName).then(function (response) {
				return response.data
			})
		},
		refresh: function (serviceName) {
			return this.executeCommand('refresh', serviceName)
		},
		build: function (serviceName) {
			return this.executeCommand('build', serviceName)
		},
		dockerize: function (serviceName) {
			return this.executeCommand('docker', serviceName)
		},
		init: function () {
			return this.executeCommand('compose', '')
		},
		rebuildAndInit: function () {
			return this.executeCommand('compose', 'init')
		},
		killAll: function () {
			return this.executeCommand('kill', 'all')
		}
	};
});

app.controller('ServiceOverviewCtrl', function ($scope, $rootScope, $http, $location, ServiceService) {

	$scope.services = [
		{
			name: 'cdc-exporter',
			composeName: 'exporter',
			url: ''
		}, {
			name: 'cdc-import-file',
			composeName: 'importer',
			url: 'http://localhost:8082'
		}, {
			name: 'cdc-campaign-ui',
			composeName: 'ui',
			url: 'http://nl.cdc.local:3000'
		}, {
			name: 'cdc-mcfm-mirror',
			composeName: 'mcfmmirror',
			url: ''
		}, {
			name: 'cdc-campaign-admin',
			composeName: 'admin',
			url: 'http://localhost:8085'
		},
		{
			name: 'cdc-optivo-mock',
			composeName: 'optivo',
			url: 'http://localhost:8083'
		},
		{
			name: 'cdc-customercache-mock',
			composeName: 'custcache',
			url: 'http://localhost:8084'
		}
	];

	$scope.healths = ['UP', 'DOWN'];

	$scope.addToHistory = function (data) {
		console.log(data)
		$rootScope.results.push(data)
	}

	$scope.determineHealth = function (service) {
		service.health = $scope.healths[1];
	}

	$scope.build = function (service) {
		ServiceService.build(service.composeName).then($scope.addToHistory)
	}

	$scope.dockerize = function (service) {
		ServiceService.dockerize(service.composeName).then($scope.addToHistory)
	}

	$scope.refresh = function (service) {
		ServiceService.refresh(service.composeName).then($scope.addToHistory)
	}

	$scope.init = function () {
		ServiceService.init().then($scope.addToHistory)
	}

	$scope.rebuildAndInit = function () {
		ServiceService.rebuildAndInit().then($scope.addToHistory)
	}

	$scope.killAll = function () {
		ServiceService.killAll().then($scope.addToHistory)
	}

	$scope.services.forEach(function (service) {
		$scope.determineHealth(service);
	});
});

app.controller('HistoryCtrl', function ($rootScope) {

});