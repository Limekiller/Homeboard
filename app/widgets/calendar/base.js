function init(widg_id){
    $("#calendarURL").on('keyup', function(e) {
        if (e.keyCode == 13) {
            console.log('ah');
            $('#url-entry').html($('#calendarURL').val());
        }
    });
}
