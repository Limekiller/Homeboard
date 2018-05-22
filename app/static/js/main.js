widg_id = 1;
jQuery(document).ready(function () {
    $(".acc-name").hover(function(){
            $(this).addClass('acc-name-hover');
            $('.acc-logout').addClass('acc-logout-hover');
        }, function(){
            $(this).removeClass('acc-name-hover');
            $('.acc-logout').removeClass('acc-logout-hover');
    });
    $("#acc-edit").on("click", function () {
        $('#header2').css('margin-top', '-900px');
        $('#header1').css('margin-top', '775px');
    });
    $("#edit_discard").on("click", function () {
        $('#header2').css('margin-top', '');
        $('#header1').css('margin-top', '');
    });
    $("#edit_widgets").on("click", function () {
        if ($('#header2').css('margin-top') == "0px") {
            $('#header2').css('margin-top', '-900px');
        } else {
            $('#header2').css('margin-top', '0px');
        }
    });
    $('.ws-widget').on('click', function() {
        var widget_title = $(this).html();
        $('#widget-area').append("<div class='widget'><div id='widg_"+widg_id+"' class='widget-i'></div></div>");
        $("#widg_"+widg_id).load("https://homeboard.bryceyoder.com/widget/"+widget_title)
        $('.widget').resizable({
            helper: "ui-resizable-helper",
            grid: 50});
        $('.widget').draggable({
            grid: [50, 50],
            });
        widg_id++;
    });
});
