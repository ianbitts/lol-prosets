(function(){
	var matchHistoryController = function($scope, $meteor, $location, championService, matchService){

        // STATIC PAGE VARIABLES //
	    $scope.summonerResult = false;
	    $scope.validation = "";
	    $scope.mapNames = {
	        '1': "Summoner's Rift",
	        '11': "Summoner's Rift",
	        '10': "Twisted Treeline",
            '12': "Howling Abyss"
	    };

	    $scope.regions = [
            { region: "br", name: "Brazil" }, { region: "eune", name: "Europe Nordic & East" }, { region: "euw", name: "Europe West" },
            { region: "lan" , name:"Latin America North" }, { region: "las" ,name: "Latin America South"},
            { region: "na", name:"North America" }, { region: "oce" , name:"Oceania" }, { region: "ru"  ,name: "Russia"},
            { region: "kr", name:"Republic of Korea" },{ region: "tr", name:"Turkey" }];

	    // Runs after champion list is retrieved from server-side API key.
	    var onComplete = function (response) {
	        $scope.heroes = championService.heroSort(response.data);
	        championService.heroList = $scope.heroes;
	        waitingDialog.hide();
	    }

        // Gets hero list from the champion service.
		if (championService.heroList.length == 0)
		{
		    waitingDialog.show('Loading champions...');
			$meteor.call("GetHeroList").then(onComplete);
		}
		else
		{	
			$scope.heroes = championService.heroList;
		}

	    

		$scope.matchDetails = function (heroId) {
            // Test whether or not a property of the match details object exists.
		    function isEmpty(myObject) {
		        for (var key in myObject) {
		            if (myObject.hasOwnProperty(key)) {
		                return false;
		            }
		        }
		        return true;
		    }

			if($scope.userName != undefined){			
			    $scope.recentMatches = "";
                waitingDialog.show('Loading match history...')
                matchService.getHeroMatchDetails($scope.userId, heroId, $scope.selected_region.region).then(function (data) {
                    waitingDialog.hide();
			        if (isEmpty(data.matches)) {
					    $scope.heroMatchResults = ": No matches found";    
						data = undefined;
					}else{
						$scope.heroMatchResults = "";
						$scope.recentMatches = matchService.recentMatchSort(data.matches);
					}		
				});
				
			}			
		}
		
		$scope.getChampionImage = function(imageId){
			var result = [];
			for(var i = 0 ; i < 1 ; i++){
				for (var key in championService.heroList) {
					if(championService.heroList.hasOwnProperty(key)){
						
						var obj = championService.heroList[key];					
						if(imageId == obj.id){
							
							result.push(obj);
							
							return result;							
						}					
					}
				}
			}
		}		
		$scope.getItemListPerMatch = function(items){	
			
			var itemList = [];
			
			for(i=0; i < 7; i++){
				if(items["item"+i] != 0){
					itemList.push(items["item"+i]);
				} else {
				    
				    itemList.push(0);

				}
			}

			return itemList;
		}
	
	
		$scope.searchUser = function (userName, region) {
		    
		    $scope.recentMatches = undefined;
			function hasWhiteSpace(s) {
				return /\s/g.test(s);
			}

			if($scope.userName){

			    matchService.getUserId(userName.replace(/\s/g, ''), region.region).then(function (data) {
			    		if(data != undefined){
			    			$scope.userName = userName;
			    			$scope.summonerResult = true;
			    			$scope.userId = data[$scope.userName.replace(/\s/g, '').toLowerCase()].id;
			    			$scope.userNameDisplay = "";
                            waitingDialog.show('Getting match history...')
                            matchService.getRecentMatchDetails($scope.userId, region.region).then(function (matchData) {
                                waitingDialog.hide();
			    				if (matchData != null)
			    				{
			    				    $scope.recentDisplayName = "Recent matches:";
			    				    $scope.userNameDisplay = data[$scope.userName.replace(/\s/g, '').toLowerCase()].name;
			    				    $scope.validation = "";
			    				    $scope.recentMatches = matchService.recentMatchSort(matchData.matches);
			    				}
			    				else
			    				{
			    				    $scope.validation = "No ranked games on this account";
			    				}
								
			    			});
			    		} else {
			    			$scope.recentDisplayName = "";
			    			$scope.validation = "Invalid username";							
			    			$scope.userId = undefined;							
			    		}						
			    }, function () { $scope.validation = "Invalid username"; });
			} else {
			    $scope.recentDisplayName = "";
			    $scope.validation = "Invalid username";
			    $scope.userId = undefined;												
		    }

			
		}


		$scope.getHeroItemSet = function (matchId){	   
		    var url = "/sets/summoner=" + $scope.userId + "/match=" + matchId;
		    $location.path(url);
		}

	};	
	
	angular.module("app").controller("matchHistoryController", ["$scope", "$meteor", "$location", "championService", "matchService", matchHistoryController]);

}());