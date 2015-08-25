(function(){
	var matchHistoryController = function($scope, $meteor, championService, matchService){

	    $scope.summonerResult = false;

	    $scope.mapNames = {
            '1': "Summoner's Rift",
	    };

		var onComplete = function (response) {
            $scope.heroes = championService.heroSort(response.data);
			championService.heroList = $scope.heroes;		
		}

		if (championService.heroList.length == 0)
		{
			$meteor.call("GetHeroList").then(onComplete);
		}
		else
		{	
			$scope.heroes = championService.heroList;
		}

        $scope.matchDetails = function(heroId){
			
			function isEmpty(myObject) {
				for(var key in myObject) {
					if (myObject.hasOwnProperty(key)) {
						return false;
					}
				}
				return true;
			}			
			
			if($scope.userName != undefined){
				
				$scope.heroMatches = "";
				matchService.getHeroMatchDetails($scope.userId, heroId).then(function(data){
					
					if(isEmpty(data.matches)){
						$scope.heroMatchResults = ": No matches found";
						data = undefined;
					}else{
						$scope.heroMatchResults = "";
						$scope.heroMatches =  matchService.recentMatchSort(data.matches);
					}		
				});
				
			} else{
				$scope.heroMatchResults = ": Usernname not searched";
			}			
		}//end
		
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
				} else{
					
				}
			}

			return itemList;
		}
	
	
		$scope.searchUser = function(userName){
			function hasWhiteSpace(s) {
				return /\s/g.test(s);
			}

			$scope.recentMatches = undefined;
			if(!hasWhiteSpace(userName)){
				if($scope.userName){
					matchService.getUserId(userName).then(function(data){
						if(data != undefined){
							$scope.userName = userName.toLowerCase();
							$scope.summonerResult = true;
							$scope.userId = data[$scope.userName].id;					
							
							matchService.getRecentMatchDetails($scope.userId).then(function(data){					
								$scope.recentDisplayName = "Recent matches";
								$scope.userNameDisplay = $scope.userName;
								$scope.recentMatches = matchService.recentMatchSort(data.matches);	
								
							});
						} else{
							$scope.recentDisplayName = "";
							$scope.userNameDisplay = "Invalid username";							
							$scope.userId = undefined;							
						}						
					});
				}
			}else{
				$scope.recentDisplayName = "";
				$scope.userNameDisplay = "Invalid username";
				$scope.userId = undefined;												
			}
		}		
	};	
	
	angular.module("app").controller("matchHistoryController", ["$scope", "$meteor", "championService", "matchService", matchHistoryController]);

}());