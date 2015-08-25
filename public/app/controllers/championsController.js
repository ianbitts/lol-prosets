(function () {

    var championsController = function ($scope, $http, championService) {

        var onComplete = function (response) {
            $scope.heroes = championService.heroSort(response.data);
        }

        championService.getHeroes().then(onComplete);

        
        $scope.heroDetails = function (index) {

            

            championService.getSingleHero(index).then(function (data) {
                $scope.singleHero = data;
                var URL = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + $scope.singleHero.key + "_0.jpg";
                document.getElementById("bg-image").style.backgroundImage = "url(" + URL + ")";
            });
            
        }

    }

    angular.module("app").controller("championsController", ["$scope", "$http", "championService", championsController]);

}());


