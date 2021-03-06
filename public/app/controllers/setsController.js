(function(){
    
    var setsController = function ($scope, $meteor, $routeParams, championService, itemService) {
        
        $scope.heroes = [];
        $scope.items = [];
        $scope.itemData = [];
        $scope.maps = [];
        $scope.version = "5.16.1";

        var starting_item_threshold = 60000; // 1 minute for starting items
        var early_game_threshold = 720000;   // 1 minute to 12 minutes.
        var mid_game_threshold = 1560000;    // 12 minutes to 26 minutes for mid game

        var onComplete = function (response) {
            $scope.heroes = championService.heroSort(response.data);
        };

        // Filter out unshoppable items from the side item panel.
        var filterItem = function (item) {
            // Filter by tags
            if (item.tags != null) {
                $scope.items.push(item);
            }
            $scope.itemData[item.id] = item;
        }
        // Executes after the item list is retrieved from a server-side API request
        var itemsComplete = function (response) {
            var itemList = response.data.data;
            for (var index in itemList)
            {
                filterItem(itemList[index]);
            }
        }
        // Executes after map data is retrieved from a server-side API request.
        var mapsComplete = function (response) {
            $scope.maps = response.data;
        }
        // Finds the participant info for the summoner that was searched on the match history page.
        var findParticipant = function (participantInfo, summonerId) {
            for (var index in participantInfo)
            {
                if (participantInfo[index].player.summonerId == summonerId)
                {
                    return { 'index': index, 'id': participantInfo[index].participantId, 'name': participantInfo[index].player.summonerName };
                }
            }
        }
        // Loads the match selected from the match history page.
        var loadMatch = function (response) {
            var match = response.data;
            var participant = findParticipant(match.participantIdentities, $routeParams.userId);
            var championId = match.participants[participant.index].championId;
            
            var blocks = [];
            var buys = [];
            var sells = [];
            var starting_purchases = [];
            var starting_sells = [];
            var early_game_purchases = [];
            var early_game_sells = [];
            var mid_game_purchases = [];
            var mid_game_sells = [];
            var late_game_purchases = [];
            var late_game_sells = [];

            var frames = match.timeline.frames;

            // Digest timeline information
            for (var index in frames)
            {
                if (frames[index].events != null)
                {
                    var events = frames[index].events
                    for (var eventIndex in events)
                    {
                        if (events[eventIndex].participantId == participant.id)
                        {
                            if (events[eventIndex].timestamp < starting_item_threshold)
                            {
                                if (events[eventIndex].eventType == "ITEM_PURCHASED")
                                {
                                    starting_purchases.push(events[eventIndex]);
                                }
                                else if (events[eventIndex].eventType == "ITEM_SOLD" || events[eventIndex].eventType == "ITEM_DESTROYED")
                                {
                                    starting_sells.push(events[eventIndex]);
                                }          
                            }
                            else if (events[eventIndex].timestamp < early_game_threshold)
                            {
                                if (events[eventIndex].eventType == "ITEM_PURCHASED")
                                {
                                    early_game_purchases.push(events[eventIndex]);
                                }
                                else if (events[eventIndex].eventType == "ITEM_SOLD" || events[eventIndex].eventType == "ITEM_DESTROYED")
                                {
                                    early_game_sells.push(events[eventIndex]);
                                }
                            }
                            else if (events[eventIndex].timestamp < mid_game_threshold)
                            {
                                if (events[eventIndex].eventType == "ITEM_PURCHASED")
                                {
                                    mid_game_purchases.push(events[eventIndex]);
                                }
                                else if (events[eventIndex].eventType == "ITEM_SOLD" || events[eventIndex].eventType == "ITEM_DESTROYED")
                                {
                                    mid_game_sells.push(events[eventIndex]);
                                }
                            }
                            else
                            {
                                if (events[eventIndex].eventType == "ITEM_PURCHASED") {
                                    late_game_purchases.push(events[eventIndex]);
                                }
                                else if (events[eventIndex].eventType == "ITEM_SOLD" || events[eventIndex].eventType == "ITEM_DESTROYED") {
                                    late_game_sells.push(events[eventIndex]);
                                }
                            }
                        }
                    }
                }
            }

            buys.push(starting_purchases);
            buys.push(early_game_purchases);
            buys.push(mid_game_purchases);
            buys.push(late_game_purchases);

            sells.push(starting_sells);
            sells.push(early_game_sells);
            sells.push(mid_game_sells);
            sells.push(late_game_sells);

            var starting_block = [];
            var early_block = [];
            var mid_block = [];
            var late_block = [];

            blocks.push(starting_block);
            blocks.push(early_block);
            blocks.push(mid_block);
            blocks.push(late_block);

            // Filter out sells/destroys from the item set blocks.
            for (var i in buys)
            {
                for (var eventIndex in buys[i])
                {
                    var add = true;
                    var item = buys[i][eventIndex].itemId;
                    for (var sellIndex in sells[i])
                    {
                        if (item == sells[i][sellIndex].itemId)
                        {
                            add = false;
                        }
                    }
                    if (add)
                    {
                        blocks[i].push(buys[i][eventIndex]);
                    }
                }
            }

            // Set item blocks
            $scope.blocks = blocks;
            $scope.blockTitles = ["Starting Items", "Early Game", "Mid Game", "Late Game"];

            // Set Map
            if (match.mapId == 1 || match.mapId == 2 || match.mapId == 11)
            {
                angular.element("div#mapSR").trigger('click');
            }
            else if (match.mapId == 4 || match.mapId == 10)
            {
                angular.element("div#mapTT").trigger('click');
            }
            else if (match.mapId == 12 || match.mapId == 14) {
                angular.element("div#mapHA").trigger('click');
            }

            // Set Champion and Set Title
            angular.element("#hero" + championId).addClass("champion-selected");
            var championName = angular.element("#hero" + championId).data('name');
            $scope.setTitle = championName + " by " + participant.name;
            waitingDialog.hide();
            angular.element("#loadComplete").trigger('click');

            // Set up DOM elements
            setTimeout(function () {
                angular.element("#loadComplete").trigger("click");
                waitingDialog.hide();
            }, 1000)
        }

        // If no match data is provided, start with an empty item set.
        var loadDefaults = function ()
        {
            $scope.blocks = [null];
            $scope.blockTitles = ["Item Block 1 - Click to change title"];
            $scope.setTitle = "New Item Set - Click to change title";
        }

        // Execution of the controller begins here, making asynchronous calls to the server.     
        waitingDialog.show('Loading Item and Match data...');
        $meteor.call("GetMapData").then(mapsComplete);
        $meteor.call("GetItemList").then(itemsComplete).then(function () {
            if ($routeParams.userId != null && $routeParams.matchId != null) {
                $meteor.call("GetMatchDetails", $routeParams.matchId, $routeParams.region).then(loadMatch);
            }
            else {
                loadDefaults();
                setTimeout(function () {
                    angular.element("#loadComplete").trigger("click");
                    waitingDialog.hide();
                }, 1000)      
            }
        });
        $meteor.call("GetHeroList").then(onComplete);
        
    };
    
    angular.module("app").controller("setsController", ["$scope", "$meteor", "$routeParams", "championService", "itemService", setsController]);    
    
}());