widg_id = 1;
var scale_factor;
jQuery(document).ready(function () {
    $(".acc-name").hover(function(){
            $(this).addClass('acc-name-hover');
            $('#acc-edit').css('margin-left', '50px');
            $('.acc-logout').addClass('acc-logout-hover');
        }, function(){
            $(this).removeClass('acc-name-hover');
            $('#acc-edit').css('margin-left', '');
            $('.acc-logout').removeClass('acc-logout-hover');
    });
    $("#acc-edit").on("click", function () {
        $('#header2').css('margin-top', '-92vh');
        $('#header1').css('margin-top', '-90px');
        $('.widget').draggable('enable');
        $('.widget').resizable('enable');
    });
    $("#edit_discard").on("click", function () {
        $('#header2').css('margin-top', '');
        $('#header1').css('margin-top', '');
        $('.widget').draggable('disable');
        $('.widget').resizable('disable');
    });
    $("#edit_widgets").on("click", function () {
        if ($('#header2').css('margin-top') == "0px") {
            $('#header2').css('margin-top', '-92vh');
        } else {
            $('#header2').css('margin-top', '0px');
        }
    });
    $('.ws-widget').on('click', function() {
        var widget_title = $(this).html();
        $('#widget-area').append("<div class='widget'><div id='widg_"+widg_id+"' class='widget-i'></div></div>");
        $('#widg_'+widg_id).load("https://homeboard.bryceyoder.com/widget/"+widget_title);
        $('.widget').resizable({
            helper: "ui-resizable-helper",
            resize(event, ui) {
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
            stop(event, ui){
                var $el = ui.element.children('.widget-i');
                $el.css({
                    transform: "translate(-50%, -50%) "+ "scale("+ scale_factor + ")"
                });
            },
            grid: 100});
        $('.widget').draggable({
            grid: [100, 100],
            });
        widg_id++;
    });

});
