widg_id = 1;
var scale_factor;

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
                helper: "ui-resizable-helper",
                resize(event, ui) {

                    // Allow automatic scaling within widget
                    var $el = ui.element.children('.widget-i');
                    var elHeight = $el.outerHeight();
                    var elWidth = $el.outerWidth();
                    var scale;
                    scale = Math.min(
                        ui.size.width / elWidth,
                        ui.size.height / elHeight
                    );
                    scale_factor = scale;
                },

                // Don't apply scaling until mouse released
                stop(event, ui){
                    var $el = ui.element.children('.widget-i');
                    $el.css({
                        transform: "translate(-50%, -50%) "+ "scale("+ scale_factor + ")"
                    });
                },
                grid: 100});

            // Enable Draggability
            $('.widget').draggable({
                grid: [100, 100],
                });
            widg_id++;
        }
    });
});
