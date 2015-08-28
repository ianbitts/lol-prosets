($(function () {

    var draggable_enabled = false;
    
    // Activate event listeners for dynamic DOM elements after giving them a chance to load.
    $("#loadComplete").click(function (event) {
        $("div.item-draggable").draggable({
            helper: "clone",
            appendTo: "body",
            connectToSortable: ".droppable",
            drag: function (event, ui) {
                ui.helper.addClass("hover-off");
            },
            stop: function (event, ui) {
                ui.helper.removeClass("hover-off");
            }
        });

        $(".droppable").sortable({
            appendTo: "body",
            item: "div.item",
            connectWith: ".droppable",
            sort: function (event, ui) {
                ui.helper.addClass("hover-off");
            },
            beforeStop: function (event, ui) {
                ui.helper.removeClass("hover-off");
            }
        });

    });

            

    // Remove an item block.
    $("body").on('click', '.remove-group', function (event) {
        $(event.target).parent().parent().parent("div.panel").remove();
    });

    // Mouse-over item details
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

            if (item.parent().hasClass("droppable"))
            {
                $("#itemDetailsDelete").text("Click to remove");
            }
            else
            {
                $("#itemDetailsDelete").text("");
            }

            detailsPanel.css({ position: "absolute", left: event.pageX + 40, top: event.pageY - 30 });
            detailsPanel.fadeIn();

        },
        function (event) { // Mouse Exit
            var detailsPanel = $("#itemDetails");
            detailsPanel.fadeOut();        
        },
        "div.item img"
    );

    // Item search box.
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

    // Champion search box.
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

    // Map selection.
    $(".map").click(function (event) {
        if ($(event.target).hasClass("btn-warning"))
        {
            // Remove the "No map selected" validation warning.
            $("#noMap").animate({
                'line-height': 0,
                'opacity': 0,
                'height': 0,
                'padding': 0,
                'margin-top': 0,
            });

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

    // Item filter checkboxes.
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

    // Cost filter checkboxes.
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
    
    // Champion selection.
    $("body").on('click', 'div.champion-icon.selectable', function (event) {
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
    
    // Click to remove items
    $(".panel-body").on('click', '.droppable div.item', function (event)
    {
        var item = $(event.target)
        if (item.is('img'))
        {
            var item = item.parent("div.item");
        }
        $(item).remove();
        $("#itemDetails").fadeOut();
    })

    // Add an item block to the item set.
    $("#addGroup").click(function () {
        // Remove "no blocks" validation warning.
        $("#noBlocks").animate({
            'line-height': 0,
            'opacity': 0,
            'height': 0,
            'padding': 0,
            'margin-top': 0,
        });

        var HTML = '<div class="panel panel-warning item-group">'
        HTML += '<div class="panel-heading">'
        HTML += '<h4 class="panel-title group-title">Click to change title<span class="remove-group pull-right">X</span></h4>';
        HTML += '</div><div class="droppable panel-body"></div>';
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

        var set_json = '{ "champions" : [ ';

        $(".champion-selected").each(function (index, element) {
            set_json += '"' + $(element).data('key') + '"';
            if (index < $(".champion-selected").length - 1)
            {
                set_json += ',';
            }
        })
        set_json += '], "page" : {';
        set_json += '"title" : "' + $(".set-title").text() + '", ',
        set_json += '"type" : "custom", ',
        set_json += '"map" : "' + $(".map.btn-success").data('map') + '", ';
        set_json += '"mode" : "any", ';
        set_json += '"blocks" : [ ';
        $("div.item-group").each(function (index, element) {
            var title = $(element).children("div.panel-heading").children("h4.group-title").text();
            set_json += '{ "type" : "' + title.substring(0, title.length - 1) + '", ';
            set_json += '"items" : [ ';
            var items = $(element).children(".panel-body").children("div");
            items.each(function (i, item) {
                set_json += '{ "id" : "' + $(item).attr('id') + '", "count" : 1 }';
                if (i < items.length - 1)
                {
                    set_json += ",";
                }
            });
            set_json += "]}";
            if (index < $("div.item-group").length - 1)
            {
                set_json += ",";
            }
        });
        set_json += "]}}";

        // Validate JSON data before submit
        validate_json = JSON.parse(set_json);
        var validated = true;
       
        // Validation warning alert boxes
        if (validate_json.page.map == "undefined")
        {
            validated = false;
            $("#noMap").animate({
                'line-height': 1.42,
                'opacity': 1,
                'height': 42,
                'padding': 12,
                'margin-top': 10,
            });
        }

        if (validate_json.page.blocks.length == 0) 
        {
            validated = false;
            $("#noBlocks").animate({
                'line-height': 1.42,
                'opacity': 1,
                'height': 42,
                'padding': 12,
                'margin-top': 10,
            });
        }

        for (var blockIndex in validate_json.page.blocks) {
            if (validate_json.page.blocks[blockIndex].items.length == 0) {
                validated = false;
                $("#noItems").animate({
                    'line-height': 1.42,
                    'opacity': 1,
                    'height': 42,
                    'padding': 12,
                    'margin-top': 10,
                });
                break;
            }
        }

        // If everything is OK, go ahead and build the item set file directory on the server and save it to the local machine.
        if (validated)
        {
            Meteor.call('ExportSetFile', set_json, function (error, response) {
                if (error == null) {
                    var zipFile = ConvertToBlob(response);
                    saveAs(blob, $(".set-title").text() + '.zip');
                }
            });
        }
        
    });
    
    // Re-title an item block.
    $("body").on('click', 'h4.group-title', function (event) {
        var value = $(event.target).text();
        var HTML = '<input type="text" class="form-control" id="newBlockTitle" placeholder="Enter block title"/>';
        $(event.target).replaceWith(HTML);
        $("#newBlockTitle").focus();

    })

    // Save the title of an item block after editing.
    $("body").on('change', '#newBlockTitle', function (event) {
        var value = $("#newBlockTitle").val();
        var HTML = '<h4 class="panel-title group-title">' + value + '<span class="remove-group pull-right">X</span></h4>';

        $(event.target).replaceWith(HTML);
    });

    // Re-title an item set.
    $("body").on('click', 'h3.set-title', function (event) {
        var value = $(event.target).text();
        var HTML = '<input type="text" class="form-control" id="newSetTitle" placeholder="Enter set title"/>';
        $(event.target).replaceWith(HTML);
        $("#newSetTitle").focus();

    });

    // Save the title of an item set after editing.
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