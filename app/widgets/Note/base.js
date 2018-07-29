function init(widg_id){

    // Fit content to size
    var element = document.getElementById('note');
    new ResizeSensor(element.parentElement, function() {
        if (element.parentElement.clientWidth < 500) {
        }
        else {
        }
    });

    // Search Drive files
    $('#drive_search').keyup(function(e){
        if(e.keyCode == 13){
            var search_val = $(this).val();
            window.setTimeout(function(){ select_file(); }, 2000);
            $.getJSON($SCRIPT_ROOT + '/drive', {
                c: "files?q=name+contains+'"+search_val+"'+and+mimeType+%3D+'application%2Fvnd.google-apps.document'&"
            }, function(data) {
                var resp = JSON.parse(data);
                $("#drive_results").html('');
                $.each(resp.files, function(i, obj) {
                    $("#drive_results").append("<p class='drive_result' name='"+obj.id+"'>"+obj.name+"</p>");
                });
                resize($("#note").parent());
            });
        }
    });

}

function select_file() {
    $('.drive_result').on('click', function() {
        file_id = $(this).attr('name');
        console.log(file_id);
        $.getJSON($SCRIPT_ROOT + '/drive', {
            c:"files/"+file_id+"/export?mimeType=text%2Fhtml&"
        }, function(data) {
            $("#note").html(data);
            $("#note").css("width", "auto");
            resize($("#note").parent());
        });
    });
}
