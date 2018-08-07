function init(widg_id){

    var element = document.getElementById('widget_name');
    new ResizeSensor(element.parentElement, function() {
        if (element.parentElement.clientWidth < 500) {
        }
        else {
        }
    });

}
