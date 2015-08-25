(function(){
    
    var itemService = function ($http) {
        
        var getItemData = function (items) {
            
        };
        
        return {
            getItemData: getItemData,
        };
    };
    
    var module = angular.module("app");
    module.factory("itemService", itemService);
}());