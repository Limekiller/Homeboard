widg_id = 1;

jQuery(document).ready(function () {

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
        $('#header2').css('margin-top', '-92vh');
        $('#header1').css('margin-top', '-90px');
        $('.widget').draggable('enable');
        $('.widget').resizable('enable');
    });

    // Discard changes
    $("#edit_discard").on("click", function () {
        $('#header2').css('margin-top', '');
        $('#header1').css('margin-top', '');
        $('.widget').draggable('disable');
        $('.widget').resizable('disable');
    });

    // Show widgets screen
    $("#edit_widgets").on("click", function () {
        if ($('#header2').css('margin-top') == "0px") {
            $('#header2').css('margin-top', '-92vh');
        } else {
            $('#header2').css('margin-top', '0px');
        }
    });

    // Select a widget
    $('.ws-widget').on('click', function() {

        if ($(this).attr('name') != undefined) {
            $(this).css('background-color', 'rgba(45,45,45,1)');
            $('#'+$(this).attr('name')).parent().remove();
            $(this).removeAttr('name');
        } else {

            // Get widget title and ID
            var widget_title = $(this).html();
            temp_widg_id = widg_id;

            $(this).css('background-color', 'red');
            $(this).attr('name', 'widg_'+temp_widg_id);

            // Add to page, load code, and fire init function that it should contain
            $('#widget-area').append("<div class='widget'><div id='widg_"+widg_id+"' class='widget-i'></div></div>");
            $('#widg_'+widg_id).load("https://homeboard.bryceyoder.com/widget/"+widget_title, function () {
                init('widg_'+temp_widg_id);
            });

            // Enable resizability
            $('.widget').resizable({
                stop(event, ui) {
                    ui.element.css('height', 50.0*Math.round(parseInt($('.ui-resizable-helper').css('height'))/50.0));
                    ui.element.css('width', 50.0*Math.round(parseInt($('.ui-resizable-helper').css('width'))/50.0));
                },
                helper: "ui-resizable-helper",
                grid: 100});

            // Enable Draggability
            $('.widget').draggable({
                grid: [100, 100],
                });
            widg_id++;
        }
    });
});
