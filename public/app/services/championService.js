(function () {

    var championService = function ($http) {

        var heroList = [];

        var heroSort = function (tempHolder) {

            var filtered = [];

            for (var key in tempHolder) {

                var obj = tempHolder[key];


                filtered.push(obj);
            }

            filtered.sort(function (a, b) {

                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;

                return 0;
            });
            heroList = filtered;
            return filtered;
        };

        return {
            heroList: heroList,
            heroSort: heroSort,
        };


    };

    var module = angular.module("app")
    module.factory("championService", championService);



}());