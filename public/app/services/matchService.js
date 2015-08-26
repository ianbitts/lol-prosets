(function () {

    var matchService = function ($meteor) {

		var getRecentMatchDetails = function(userId, region){
		    return $meteor.call("GetRecentMatchDetails", userId, region).then(
                function (response) {
                    console.log(response.data);
				    return response.data;
                },
                function () { return undefined; });
		}
		
		var getHeroMatchDetails = function( userId, heroId){

		    return $meteor.call("GetHeroMatchDetails", userId, heroId).then(
                function (response) {
                    console.log(response.data);
				    return response.data;
			    });
		}

		var getUserId = function (userName) { 
            
		    return $meteor.call("GetUserId", userName.toLowerCase()).then(function (response) {
				return response.data;
			},
            function () {
                return undefined;
            });
		}
		
		var capitalize = function(s){
				return s.charAt(0).toUpperCase() + s.slice(1);
		}
			
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
		

        return {
			getRecentMatchDetails:getRecentMatchDetails,
			getUserId:getUserId,
			recentMatchSort:recentMatchSort,
			getHeroMatchDetails:getHeroMatchDetails
        };


    };

    var module = angular.module("app")
    module.factory("matchService", matchService);



}());