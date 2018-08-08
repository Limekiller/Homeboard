widg_id = 1;

jQuery(document).ready(function () {
    $.ajax({
        url: '/load',
        success: function(data) {
            if (data != "null") {
                $("body").html(data);
                window.setTimeout(function(){ $("body").css("opacity", 1); }, 1000);
            } else {
                $("body").css("opacity", 1);
            }
        }
    });
    window.setTimeout(function(){enablePage(true);},1000);
});

function enablePage(initial) {
    var savedPageContent;
    var bgColor;

    // Enable all widgets if this function is being called due to the discard button
    $(".widget").each(function(i, obj) {
        initUI($(this));
        if (initial) {
            $(this).css("opacity", "0");
            old_widg_id = $(this).children(".widget-i").attr("id");
            $(this).children(".widget-i").attr("id", "widg_"+i);
            $("[name='"+old_widg_id+"']").attr('name', 'widg_'+i);
            $('#widg_'+i).load("https://homeboard.bryceyoder.com/widget/"+$(this).attr('name'), function () {
                init('widg_'+i);
            });
            window.setTimeout(function(){$("#widg_"+i).parent().css("opacity", 1);console.log('wow');}, 250+(i*200));
        }
        widg_id++;
        $(this).draggable('disable');
        $(this).resizable('disable');
        $(this).children('.ui-resizable-handle').each(function(i,obj){
            $(this).css('display', 'none');
        });
    });

    // Show Logout on profile image hover
    $(".acc-name").hover(function(){
        $(this).addClass('acc-name-hover');
        $('#acc-edit').css('margin-left', '50px');
        $('.acc-logout').addClass('acc-logout-hover');
    }, function(){
        $(this).removeClass('acc-name-hover');
        $('#acc-edit').css('margin-left', '');
        $('.acc-logout').removeClass('acc-logout-hover');
    });

    // Enable edit mode
    $("#acc-edit").on("click", function () {
        savedPageContent = $("body").html();
        bgColor = $("body").css("background-color");

        $(".widget").each(function(i, obj) {
            $(this).draggable('enable');
            $(this).resizable('enable');
            $(this).children('.ui-resizable-handle').each(function(i,obj){
                $(this).css('display', '');
                if (i > 2) {
                    $(this).remove();
                }
            });
        });

        $('#header2').css('margin-top', '-92vh');
        $('#header1').css('margin-top', '-90px');
        $('.widget-i').css('border', '1px solid');
    });

    // Save changes
    $("#edit_save").on("click", function () {
        $('#header2').css('margin-top', '');
        $('#header1').css('margin-top', '');
        $('.widget').draggable('disable');
        $('.widget').resizable('disable');
        $('.widget-i').css('border', 'none');
        var pagedata = $("body").html();
        $.post(
                '/save',
                {page_data: pagedata }
              ).done( function(data) {
        });
    });

    // Discard Changes
    $("#edit_discard").on("click", function() {
        clearInterval(window.colorChangeInterval);
        $("body").css({
            "transition" : "opacity 0s ease",
            "opacity" : 0,
            "background-color" : bgColor
        });
        $('#header2').css('margin-top', '');
        $('#header1').css('margin-top', '');
        $('.widget').draggable('disable');
        $("body").html(savedPageContent);
        enablePage(false);
        $("body").css("transition", "opacity 0.1s ease, background-color 0.4s ease");
        window.setTimeout(function(){
            $("body").css("opacity", 1);
        }, 25);
    });


    // Show widgets screen
    $("#edit_widgets").on("click", function () {
        if ($('#header2').css('margin-top') == "0px") {
            $('#header2').css('margin-top', '-92vh');
        } else {
            $('#header2').css('margin-top', '0px');
        }
    });


    // Show Styles screen
    $("#edit_color").on("click", function() {
        $('#header2').css('margin-top', '');
        $('#styles-area').css('bottom', '0px');
        $('.widget').draggable('disable');
        $('.widget').resizable('disable');
        $('.widget-i').css('border', 'none');
    });


    // Close Styles Screen
    $("#styles_close").on("click", function() {
        $('#header2').css('margin-top', '-92vh');
        $('.widget').draggable('enable');
        $('.widget').resizable('enable');
        $('.widget-i').css('border', '1px solid');
        $('#styles-area').css('bottom', '');
    });


    // Begin calling color-change function
    $(".style").on("click", function() {
        var thisid = $(this).attr('id');
        if (window.colorChangeInterval) {
            clearInterval(window.colorChangeInterval);
        }
        colorChange(thisid);
        window.colorChangeInterval = window.setInterval(function() { colorChange($('#'+thisid).attr('id'));}, 1000);
    });

    function colorChange(swatchid) {
        $("#"+swatchid).children().each(function(index) {
            if (index == 3) {
                $(".color4").css("color", $(this).css("background-color")+" !important");
            } else {
                $(".color"+(index+1)).css("background-color", $(this).css("background-color"));
            }
        });
    }


    // Select a widget
    $('.ws-widget').on('click', function() {

        if ($(this).attr('name') != undefined) {
            $(this).children('img').css('filter', 'invert(0.5)');
            $('#'+$(this).attr('name')).parent().remove();
            $(this).removeAttr('name');
        } else {

            // Get widget title and ID
            var widget_title = $(this).children("img").attr('name');
            temp_widg_id = widg_id;

            $(this).children('img').css('filter', 'invert(1)');
            $(this).attr('name', 'widg_'+temp_widg_id);

            // Add to page, load code, and fire init function that it should contain
            $('#widget-area').append("<div class='widget color4' name='"+widget_title+"'><div id='widg_"+widg_id+"' class='widget-i color2'></div></div>");
            $('#widg_'+widg_id).load("https://homeboard.bryceyoder.com/widget/"+widget_title, function () {
                init('widg_'+temp_widg_id);
            });

            // Enable resizability
            initUI($('.widget'));
            widg_id++;
        }
    });
}

function initUI(element) {
    element.resizable({
        stop(event, ui) {
            ui.element.css('height', 50.0*Math.round(parseInt($('.ui-resizable-helper').css('height'))/50.0));
            ui.element.css('width', 50.0*Math.round(parseInt($('.ui-resizable-helper').css('width'))/50.0));
            setTimeout(function() {
                resize(ui.element.children('.widget-i'));
            }, 100);
        },
        helper: "ui-resizable-helper",
        grid: 100});

    // Enable Draggability
    $(element).draggable({
        grid: [100, 100],
    });

}

function resize(element) {
    var new_width = $(element).width();
    var new_height = $(element).height();

    if (new_width / 250 > new_height / 250) {
        while (new_width / 250 * $(element).children('.w_base').height() > new_height - 25) {
            new_width = new_width - 25;
        }
        var scale_factor = new_width / 250;

    } else if (new_height / 250 > new_width / 250) {
        while (new_height / 250 * $(element).children('.w_base').width() > new_width - 25) {
            new_height = new_height - 25;
        }
        var scale_factor = new_height / 250;

    } else {
        while (new_height / 250 * $(element).children('.w_base').width() > new_width - 50) {
            new_height = new_height - 25;
        }
        var scale_factor = new_height / 250;
    }

    $(element).children().css("transform", "translateY(-50%) scale("+scale_factor+")");
}
