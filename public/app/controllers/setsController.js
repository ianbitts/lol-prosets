(function(){
    
    var setsController = function($scope, $meteor, championService, itemService) {

        $scope.heroes = [];
        $scope.items = [];
        $scope.maps = [];
        $scope.version = "5.16.1";

        var onComplete = function (response) {
            $scope.heroes = championService.heroSort(response.data);
        };
        
        var filterItem = function (item) {

            // Filter by tags
            if (item.tags != null) {
                $scope.items.push(item);
            }
        }

        var itemsComplete = function (response) {
            var itemList = response.data.data;
            for (var index in itemList)
            {
                filterItem(itemList[index]);
            }
        }

        var mapsComplete = function (response) {
            $scope.maps = response.data;
        }

        $meteor.call("GetMapData").then(mapsComplete);
        $meteor.call("GetItemList").then(itemsComplete);
        $meteor.call("GetHeroList").then(onComplete);
        
    };
    
    angular.module("app").controller("setsController", ["$scope", "$meteor", "championService", "itemService", setsController]);    
    
}());