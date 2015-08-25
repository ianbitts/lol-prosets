if (Meteor.isServer) {
    
    var version = "5.16.1"

    Meteor.methods({

        GetItemList: function () {
            this.unblock();
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?version=5.16.1&itemListData=all&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            var result = HTTP.call("GET", url);
            return result;
        },

        GetRecentMatchDetails: function (userId) {
            this.unblock();
            var url = "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + userId + "?beginIndex=0&endIndex=15&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            return HTTP.call("GET", url);
        },

        GetHeroMatchDetails: function (userId, heroId){
            this.unblock();
            var url = "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + userId 
				+ "?championIds=" + heroId + "&beginIndex=0&endIndex=15&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            return HTTP.call("GET", url);
        },

        GetUserId: function (userName){
            this.unblock();
            var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + userName + "?api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
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
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + index + "?champData=info,spells,tags&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015";
            return HTTP.call("GET", url).data;
        },

        GetMapData: function (index) {
            var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/map?version=5.14.1&api_key=fc9cb83e-8c1d-488a-b71c-52c65f9ae015"
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
                globalFolder.file(JSON.stringify(json.page.title) + '.json', JSON.stringify(json.page));
            }
            

            return zip.generate({ type: "base64" });
        },

    })
}