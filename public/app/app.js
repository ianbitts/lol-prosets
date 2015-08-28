(function () {

    var app = angular.module("app", ["angular-meteor", "ngRoute", "ngAnimate", "angular-preload-image"]);

    app.config(function ($routeProvider, $locationProvider) {

        $routeProvider
        .when("/", {
            templateUrl: "app/views/home.html"
        })
        .when("/sets/summoner=:userId/match=:matchId", {
            templateUrl: "app/views/sets.html",
            controller: "setsController",
        })
        .when("/sets/", {
            templateUrl: "app/views/sets.html",
            controller: "setsController",
        })
        .when("/matchHistory/", {
            templateUrl: "app/views/matchHistory.html",
            controller: "matchHistoryController"
        })		
        .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode(true);
    });

    // Handles images that cannot be loaded by Data Dragon
    app.directive('errImg', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () {

                    if (attrs.src != attrs.errImg) {
                        element[0].src = "/content/images/" + scope.hero.key + ".png";
                    }
                });
            }
        }
    });

}());