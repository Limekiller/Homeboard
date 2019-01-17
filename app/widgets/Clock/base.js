function init(widg_id){
    updateClock();
    setInterval(function() { updateClock(); }, 1000);
    var element = document.getElementById('clock');
    new ResizeSensor(element.parentElement, function() {
        if (element.parentElement.clientWidth < 500) {
            $("#clock2").css('display', '');
            $("#clock1").css('display', '');
        }
        else {
            $("#clock2").css('display', 'none');
            $("#clock1").css('display', 'inherit');
            $("#week").css('width', $('#clock1_time').css('width'));
        }
    });

}


function updateClock()
{
    var currentTime = new Date();

    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );
    var currentSeconds = currentTime.getSeconds ( );
    var currentDay = currentTime.getDay();
    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
    currentHours = (currentHours < 10 ? "0" : "" ) + currentHours;

    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
    $("#clock1_time").html(currentTimeString);
    var currentTimeString = currentHours + "<br>" + currentMinutes;
    $("#clock2_time").html(currentTimeString);
    $("#week").children().eq(currentDay).css('color', 'rgba(255,255,255,1)');
    $("#week").children().eq(currentDay).css('opacity', '1');
};
