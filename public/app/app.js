(function () {

    var app = angular.module("app", ["angular-meteor", "ngRoute", "ngAnimate", "angular-preload-image"]);

    app.config(function ($routeProvider) {

        $routeProvider
        .when("/champions", {
            templateUrl: "app/views/champions.html",
            controller: "championsController"

        })
        .when("/sets/summoner=:userId/match=:matchId", {
            templateUrl: "app/views/sets.html",
            controller: "setsController",
        })
        .when("/matchHistory", {
                templateUrl: "app/views/matchHistory.html",
                controller: "matchHistoryController"

            })
		.when("/about", {
		    templateUrl: "app/views/about.html"
		    //,controller: "matchHistoryController"

		})
        .otherwise({ redirectTo: "/" });
    });


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