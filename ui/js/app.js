var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngSanitize']);

app.config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(false);
    var routes = [
        {
            location: '/',
            template: 'start.html'
        }, {
            location: '/history',
            template: 'history.html'
        }, {
            location: '/error',
            template: 'error.html'
        }
    ];

	routes.forEach(function (route) {
		$routeProvider.when(route.location, {
            templateUrl: 'partials/' + route.template
        });
	});

    $routeProvider.otherwise({redirectTo: '/error'});
});

app.run(function($rootScope) {
    $rootScope.results = [];
});

app.factory('ServiceManager', function($http) {
    return {
        executeCommand: function(command, serviceName) {
            return $http.post(command + '/' + serviceName).then(function(response) {
                return response.data
            })
        },
        refresh: function(serviceName) {
            return this.executeCommand('refresh', serviceName)
        },
        build: function(serviceName) {
            return this.executeCommand('build', serviceName)
        },
        dockerize: function(serviceName) {
            return this.executeCommand('docker', serviceName)
        },
        init: function() {
            return this.executeCommand('compose', '')
        },
        rebuildAndInit: function() {
            return this.executeCommand('compose', 'init')
        },
        killAll: function() {
            return this.executeCommand('kill', 'all')
        }
    };
});

app.controller('ServiceOverviewCtrl', function($scope, $rootScope, $http, $location, ServiceManager) {

    $scope.services = []; // todo: get from somewhere via $http via NodeJS backend

    $scope.healths = ['UP', 'DOWN'];

    $scope.addToHistory = function(data) {
        console.log(data)
        $rootScope.results.push(data)
    }

    $scope.determineHealth = function(service) {
        service.health = $scope.healths[1];
    }

    $scope.build = function(service) {
        ServiceManager.build(service.composeName).then($scope.addToHistory)
    }

    $scope.dockerize = function(service) {
        ServiceManager.dockerize(service.composeName).then($scope.addToHistory)
    }

    $scope.refresh = function(service) {
        ServiceManager.refresh(service.composeName).then($scope.addToHistory)
    }

    $scope.init = function() {
        ServiceManager.init().then($scope.addToHistory)
    }

    $scope.rebuildAndInit = function() {
        ServiceManager.rebuildAndInit().then($scope.addToHistory)
    }

    $scope.killAll = function() {
        ServiceManager.killAll().then($scope.addToHistory)
    }

    $scope.services.forEach(function(service) {
        $scope.determineHealth(service);
    });
});

app.controller('HistoryCtrl', function($rootScope) {});
