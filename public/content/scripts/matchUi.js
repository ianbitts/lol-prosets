$(function () {

    $("#searchChampions").on('input', function () {
        var search = $("#searchChampions").val().toLowerCase();
        var champs = $("div.champion-icon");
        $(champs).each(function (index, element) {
            var name = $(element).data('name').toLowerCase();
            if (name.indexOf(search) == -1) {
                $(element).hide();
            }
            else {
                $(element).show();
            }
        })
    });

    
    //if($('#itemDetails').text() == 0) {
    //    $('#itemDetails').removeClass("mouseOver");
    //} else {
    //    $('#itemDetails').addClass("mouseOver");
    //}


    
        
    


});

