(function(){
    
    var itemService = function ($meteor) {
        
        var items = [];

        var getItemData = function () {

            if (items.length == 0) {
                console.log("did api request");
                return $meteor.call("GetItemList").then(function (response) {
                    items = response.data.data;
                    return items;
                });
            }

            return items;
        };
        
        return {
            getItemData: getItemData,
        };
    };
    
    var module = angular.module("app");
    module.factory("itemService", itemService);
}());