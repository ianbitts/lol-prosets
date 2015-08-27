// Service for retrieving items from server-side API call.

(function () {
    
    var itemService = function ($meteor) {
        
        var items = [];

        var getItemData = function () {

            if (items.length == 0) {
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