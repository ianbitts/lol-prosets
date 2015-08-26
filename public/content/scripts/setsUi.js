($(function () {

    var draggable_enabled = false;
    
    $(document).ready(function () {
        waitingDialog.show('Please wait...');
        setTimeout(function () {
            waitingDialog.hide();
            $("div.item").draggable({
                helper: "clone",
                appendTo: "body",
                drag: function (event, ui) {
                    ui.helper.addClass("hover-off");
                }
            });
            $(".droppable").droppable({
                accept: "div.item",
                drop: function (event, ui) {
                    $(this).find(".placeholder").remove();
                    $(ui.draggable).clone().appendTo(this);
                }
            });
        }, 4000);
    });

    $("body").on('click', '.remove-group', function (event) {
        $(event.target).parent().parent().parent("div.panel").remove();
    });

    $("body").hoverIntent(
        function (event) { // Mouse Enter
            var detailsPanel = $("#itemDetails");
            var item = $(event.target);

            if (item.is("img")) {
                item = $(item).parent("div.item");
            }

            var name = item.data('name');
            var gold = item.data('gold');
            var sell = item.data('sell');
            var desc = item.data('desc');

            $("#itemDetailsName").text(name);
            $("#itemDetailsDesc").text(desc);
            $("#itemDetailsGold").text("Buy:" + gold + " Sell: " + sell);

            detailsPanel.css({ position: "absolute", left: event.pageX + 40, top: event.pageY - 30 });
            detailsPanel.fadeIn();

        },
        function (event) { // Mouse Exit
            var detailsPanel = $("#itemDetails");
            detailsPanel.fadeOut();        
        },
        "div.item img"
    );


    $("#searchItems").on('input', function () {
        var search = $("#searchItems").val().toLowerCase();
        var items = $("div.item-panel .item");
        $(items).each(function (index, element) {
            var name = $(element).data('name').toLowerCase();
            if ( name.indexOf(search) == -1)
            {
                $(element).addClass("hide-search");
            }
            else
            {
                $(element).removeClass("hide-search");
            }
        })
    });

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

    $(".map").click(function (event) {
        if ($(event.target).hasClass("btn-warning"))
        {
            $(".map.btn-success").addClass("btn-warning");
            $(".map.btn-success").removeClass("btn-success");
            $(event.target).removeClass("btn-warning");
            $(event.target).addClass("btn-success");

            $("div.btn-warning").each(function (index, element) {
                var gooditems = $(element).data('baditems');
                for (var index in gooditems) {
                    $("div.item-panel div#" + gooditems[index]).removeClass("hide-map");
                }
            });

            var baditems = $(event.target).data("baditems");
            for (var index in baditems) {
                $("div.item-panel div#" + baditems[index]).addClass("hide-map");
            }
            
        }
        else if ($(event.target).hasClass("btn-success"))
        {
            $(event.target).removeClass("btn-success");
            $(event.target).addClass("btn-warning");

            var baditems = $(event.target).data("baditems");
            for (var index in baditems) {
                $("div.item-panel div#" + baditems[index]).removeClass("hide-map");
            }
        }
    });

    $(".filterChkbox").click(function (event) {
        var items = $("div.item-panel .item");
        items.removeClass("hide-filter");
        $(".filterChkbox:checked").each(function (index, element) {
            var filter_tags = $(element).data('filter');
            items.each(function (i, item) {
                var item_tags = $(item).data('tags');
                var match = false;
                for (var tag_index in item_tags)
                {
                    if ( $.inArray(item_tags[tag_index], filter_tags) != -1)
                    {
                        match = true;
                    }
                }
                if (!match)
                {
                    $(item).addClass("hide-filter");
                }
            });
        });
    });

    $(".costChkbox").click(function (event) {
        var items = $("div.item-panel .item");
        items.removeClass("hide-cost");
        $(".costChkbox:checked").each(function (index, element) {
            var filter_range = $(element).data('filter');
            items.each(function (i, item){
                var cost = $(item).data('gold');
                if (cost < filter_range[0] || cost > filter_range[1])
                {
                    $(item).addClass("hide-cost")
                }
            });
        });
    });
    
    $("body").on('click', 'div.champion-icon', function (event) {
        var champ = $(event.target);
        
        if (champ.is("img") || champ.is("span"))
        {
            champ = $(event.target).parent("div.champion-icon");
        }

        if (champ.hasClass("champion-selected"))
        {
            champ.removeClass("champion-selected");
        }
        else {
            champ.addClass("champion-selected");
        }        
    })

    $(".panel-body").on('click', 'div.item', function (event) {
        if (draggable_enabled == false)
        {
            $("div.item").draggable({
                helper: "clone",
                appendTo: "body"
            })
            draggable_enabled = true;
        }
    })
    
    $(".panel-body").on('click', '.droppable div.item', function (event)
    {
        $(event.target).remove();
        $("#itemDetails").fadeOut();
    })

    $("#addGroup").click(function () {
        var HTML = '<div class="panel panel-warning item-group"><div class="panel-heading"><h4 class="panel-title group-title">Click to change title<span class="remove-group pull-right">X</span></h4>';
        HTML +=    '</div><div class="droppable panel-body"></div>';
        if ($(".item-group").length == 0)
        {
            $("#addGroup").before(HTML);
        }
        else {
            $(".block-panel").children(".item-group").last().after(HTML)
        }

        $(".droppable").droppable({
            accept: "div.item",
            drop: function (event, ui) {
                $(this).find(".placeholder").remove();
                $(ui.draggable).clone().appendTo(this);
            }
        });

    });

    // Build JSON and send to server
    $("#download").click(function () {
        var JSON = '{ "champions" : [ ';

        $(".champion-selected").each(function (index, element) {
            JSON += '"' + $(element).data('key') + '"';
            if (index < $(".champion-selected").length - 1)
            {
                JSON += ',';
            }
        })
        JSON += '], "page" : {';
        JSON += '"title" : "' + $(".set-title").text() + '", ',
        JSON += '"type" : "custom", ',
        JSON += '"map" : "' + $(".map.btn-success").data('map') + '", ';
        JSON += '"mode" : "any", ';
        JSON += '"blocks" : [ ';
        $("div.item-group").each(function (index, element) {
            var title = $(element).children("div.panel-heading").children("h4.group-title").text();
            JSON += '{ "type" : "' + title.substring(0, title.length - 1) + '", ';
            JSON += '"items" : [ ';
            var items = $(element).children(".panel-body").children("div");
            items.each(function (i, item) {
                JSON += '{ "id" : "' + $(item).attr('id') + '", "count" : 0 }';
                if (i < items.length - 1)
                {
                    JSON += ",";
                }
            });
            JSON += "]}";
            if (index < $("div.item-group").length - 1)
            {
                JSON += ",";
            }
        });
        JSON += "]}}";
        console.log(JSON);

        Meteor.call('ExportSetFile', JSON, function (error, response) {
            if (error == null)
            {
                var zipFile = ConvertToBlob(response);
                saveAs(blob, $(".set-title").text() + '.zip');
            }
        });
    });
    
    $("body").on('click', 'h4.group-title', function (event) {
        var value = $(event.target).text();
        var HTML = '<input type="text" class="form-control" id="newBlockTitle" placeholder="Enter block title"/>';
        $(event.target).replaceWith(HTML);
        $("#newBlockTitle").focus();

    })

    $("body").on('change', '#newBlockTitle', function (event) {
        var value = $("#newBlockTitle").val();
        var HTML = '<h4 class="panel-title group-title">' + value + '<span class="remove-group pull-right">X</span></h4>';

        $(event.target).replaceWith(HTML);
    });

    $("body").on('click', 'h3.set-title', function (event) {
        var value = $(event.target).text();
        var HTML = '<input type="text" class="form-control" id="newSetTitle" placeholder="Enter set title"/>';
        $(event.target).replaceWith(HTML);
        $("#newSetTitle").focus();

    });

    $("body").on('change', '#newSetTitle', function (event) {
        var value = $("#newSetTitle").val();
        var HTML = '<h3 class="panel-title set-title">' + value + '</h3>';

        $(event.target).replaceWith(HTML);
    });

    // CREDIT: Ryan Glover
    // Tutorial at: http://themeteorchef.com/recipes/exporting-data-from-your-meteor-application/#tmc-setting-up-our-zip-file
    var ConvertToBlob = function (data) {
        var charArray = atob(data);
        var numArray = new Array(charArray.length);
        var index = 0;
        while ( index < charArray.length)
        {
            numArray[index] = charArray.charCodeAt(index);
            index++;
        }
        byteArray = new Uint8Array(numArray)
        return blob = new Blob([byteArray], { type: "zip" });
    };

}));