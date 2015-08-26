(function(){
    
    var setsController = function ($scope, $meteor, $routeParams, championService, itemService) {

        $scope.heroes = [];
        $scope.items = [];
        $scope.itemData = [];
        $scope.maps = [];
        $scope.version = "5.16.1";
        
        var block_seperation_duration = "60000"; // 60 second duration for one block
            
        var onComplete = function (response) {
            $scope.heroes = championService.heroSort(response.data);
        };
        
        var filterItem = function (item) {
            // Filter by tags
            if (item.tags != null) {
                $scope.items.push(item);
            }
            $scope.itemData[item.id] = item;
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

        var findParticipant = function (participantInfo, summonerId) {
            for (var index in participantInfo)
            {
                if (participantInfo[index].player.summonerId == summonerId)
                {
                    return { 'index': index, 'id': participantInfo[index].participantId };
                }
            }
        }

        var loadMatch = function (response) {
            var match = response.data;
            console.log(match);
            var participant = findParticipant(match.participantIdentities, $routeParams.userId);
            var championId = match.participants[participant.index].championId;
            var blocks = [];
            var block_events = [];
            var frames = match.timeline.frames;

            for (var index in frames)
            {
                if (frames[index].events != null)
                {
                    var events = frames[index].events
                    for (var eventIndex in events)
                    {
                        if (events[eventIndex].participantId == participant.id && events[eventIndex].eventType == "ITEM_PURCHASED")
                        {
                            if (block_events.length == 0 || (events[eventIndex].timestamp - block_events[0].timestamp) < block_seperation_duration )
                            {
                                block_events.push(events[eventIndex]);
                            }
                            else
                            {
                                blocks.push(block_events);
                                block_events = [];
                            }
                        }
                    }
                }
            }
            $scope.blocks = blocks;
        }
        var loadDefaults = function () {

        }

        $meteor.call("GetMapData").then(mapsComplete);
        $meteor.call("GetItemList").then(itemsComplete).then(function () {
            if ($routeParams.userId != null && $routeParams.matchId != null) {
                $meteor.call("GetMatchDetails", $routeParams.matchId).then(loadMatch);
            }
            else {
                loadDefaults();
            }
        });
        $meteor.call("GetHeroList").then(onComplete);
        
    };
    
    angular.module("app").controller("setsController", ["$scope", "$meteor", "$routeParams", "championService", "itemService", setsController]);    
    
}());