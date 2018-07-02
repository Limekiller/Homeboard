function init(widg_id){
    $("#calendarURL").on('keyup', function(e) {
        if (e.keyCode == 13) {
            console.log('ah');
            $('#url-entry').html($('#calendarURL').val());
        }
    });

    // Get user's calendar list
    $.getJSON($SCRIPT_ROOT + '/calendar', {
        c: 'calendarList?',
        cid: 'me',
        base: '/calendar/v3/users/'
    }, function(data) {
        var resp = JSON.parse(data);
        $.each(resp.items, function(i, obj) {
            $("#cal_list").append("<li>"+obj.summary+"</li>");
        });
    });


}

