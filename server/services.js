if (Meteor.isServer) {
    
    var version = "5.16.1"
    var api_key = // KEY GOES HERE

    Meteor.methods({

        GetItemList: function () {
            this.unblock();
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?version=5.16.1&itemListData=all&api_key=" + api_key;
            return HTTP.call("GET", url);
        },

        GetMatchDetails: function (matchId, region) {
            this.unblock();
            if (region == null)
            {
                region = "na";
            }
            var url = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/match/" + matchId + "?includeTimeline=true&api_key=" + api_key;
            return HTTP.call("GET", url);
        },

        GetRecentMatchDetails: function (userId, region) {
            this.unblock();
            
            var url = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/matchhistory/" + userId + "?beginIndex=0&endIndex=15&api_key=" + api_key;
            console.log(url);
            return HTTP.call("GET", url);
        },

        GetHeroMatchDetails: function (userId, heroId, region){
            this.unblock();
            var url = "https://" + region + ".api.pvp.net/api/lol/" + region +"/v2.2/matchhistory/" + userId 
				+ "?championIds=" + heroId + "&beginIndex=0&endIndex=15&api_key=" + api_key;
            return HTTP.call("GET", url);
        },

        GetUserId: function (userName, region){
            this.unblock();
            
            var url = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + userName + "?api_key=" + api_key;
            return HTTP.call("GET", url);
        },

        GetSpecificItem: function (itemId) {
            this.unblock();
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/";
            url += itemId + "?itemData=all&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            return HTTP.call("GET", url).data;
        },

        GetHeroList: function () {
            this.unblock();
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            return HTTP.call("GET", url).data;
        },

        GetSingleHero: function (index) {
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + index + "?champData=info,spells,tags&api_key=" + api_key;
            return HTTP.call("GET", url).data;
        },

        GetMapData: function (index) {
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/map?version=5.14.1&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015"
            return HTTP.call("GET", url).data;
        },
        GetItemData: function (items) {
            this.unblock();
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + items + "?api_key=" + api_key;;

            return HTTP.call("GET", url).data;
        },
        GetChallengerLeague: function(region){
            this.unblock();
            var url = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=" + api_key;;
            return HTTP.call("GET", url).data;
        },

        ExportSetFile: function (json) {
            var zip = new JSZip();
            json = JSON.parse(json);

            var configFolder = zip.folder('Config');
            var globalFolder = configFolder.folder("Global").folder("Recommended");
            var championsFolder = configFolder.folder("Champions");

            if (json.champions.length > 0)
            {
                for (var index in json.champions) {
                    var championFile = championsFolder.folder(json.champions[index]).folder("Recommended").file(json.page.title + '.json', JSON.stringify(json.page));
                }
            }
            else {
                globalFolder.file(json.page.title + '.json', JSON.stringify(json.page));
            }
            

            return zip.generate({ type: "base64" });
        },

    })
}