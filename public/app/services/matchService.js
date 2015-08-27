// Service for getting match details and recent matches for summoners using the League of Legends API.

(function () {

    var matchService = function ($meteor) {

        // Get the recent matches of a player given their userID and region.
		var getRecentMatchDetails = function(userId, region){
		    return $meteor.call("GetRecentMatchDetails", userId, region).then(
                function (response) {               
				    return response.data;
                },
                function () { return undefined; });
		}

		// Get the recent matches of a player given their userId, region and filter by a specific champion.
		var getHeroMatchDetails = function( userId, heroId, region){
		    return $meteor.call("GetHeroMatchDetails", userId, heroId, region).then(
                function (response) {                    
				    return response.data;
			    });
		}

        // Get the userId of a summoner using their name.
		var getUserId = function (userName, region) { 	    
		    return $meteor.call("GetUserId", userName.toLowerCase(), region).then(function (response) {
		        return response.data;
		    });
		}
		
		var capitalize = function(s){
			return s.charAt(0).toUpperCase() + s.slice(1);
		}
		
        // Manipulate match data for display purposes.
		var recentMatchSort = function(data){
			
			for (var key in data) {				
				//change game Rankt type name
				var myString = data[key].queueType.replace(/_/g, " ");												
				myString = myString.toLowerCase();
				var lowerCaseArray = myString.split();				
				lowerCaseArray[0] = capitalize(lowerCaseArray[0]);				
				data[key].queueType = lowerCaseArray[0];
				
				//loop though to change winner
				if(data[key].participants[0].stats.winner){
					
					data[key].participants[0].stats.winner = 'W';
				} else{
					
					data[key].participants[0].stats.winner = 'L';
				}
				
            }
			return data;			
		}

		var getItemData = function (items) {
		    return $meteor.call("GetItemData", items).then(
               function (response) {
                   return response.data;
               });
		}
		

        return {
			getRecentMatchDetails:getRecentMatchDetails,
			getUserId:getUserId,
			recentMatchSort:recentMatchSort,
			getHeroMatchDetails: getHeroMatchDetails,
			getItemData: getItemData
        };


    };

    var module = angular.module("app")
    module.factory("matchService", matchService);



}());