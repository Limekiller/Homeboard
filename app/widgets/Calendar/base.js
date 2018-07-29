var view_mode = 2;

function init(widg_id){
    $("#calendarURL").on('keyup', function(e) {
        if (e.keyCode == 13) {
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
            $("#cal_list").append("<li name="+obj.id+">"+obj.summary+"</li>");
        });
    });
    window.setTimeout(cal_list_add_css, 1500);

    // Get events from each calendar
    $("#cal_select button").on('click', function() {
        $("#calendar").css("width", "100%");
        let cal_array = [];
        $("#cal_list li").each(function(index) {
            if($(this).css('text-decoration-line')=='underline'){
                cal_array.push($(this).attr('name'));
            }
        });
        get_events(cal_array);
        window.setInterval(function(){
            let used_cal_array = [];
            $(".used_cal_list p").each(function(index){
                used_cal_array.push($(this)[0].textContent);
            });
            get_events(used_cal_array);
        }, 300000);
    });

    var element = document.getElementById('calendar');
    new ResizeSensor(element.parentElement, function() {
        if ((element.parentElement.clientHeight - element.parentElement.clientWidth) > 700 || (element.parentElement.clientHeight < 550 && element.parentElement.clientWidth < 550) || element.parentElement.clientWidth < 550) {
            view_mode = 0;
            $("#cal_results_month").css('display', 'none');
            $("#cal_results_week").css('display', 'none');
            $("#cal_results_day").css('display', '');
            $("#cal_results_day").css('opacity', '1');
            $("#cal_header").css('display', 'none');

        } else if ((element.parentElement.clientWidth - element.parentElement.clientHeight) > 700) {
            view_mode = 1;
            $("#cal_results_month").css('display', 'none');
            $("#cal_results_day").css('display', 'none');
            $("#cal_results_week").css('display', '');
            $("#cal_results_week").css('opacity', '1');
            $("#cal_header").css('display', '');

        } else {
            view_mode = 2;
            $("#cal_results_month").css('display', '');
            $("#cal_results_month").css('display', '1');
            $("#cal_results_week").css('display', 'none');
            $("#cal_results_day").css('display', 'none');
            $("#cal_header").css('display', '');
        }
    });
}


function get_events(cal_array){
    var date_n = new Date();
    var day_of_month = date_n.getDate();
    var month_of_year = date_n.getMonth();
    var days_in_month = new Date(date_n.getFullYear(), month_of_year, 0).getDate();
    var date_p = new Date(date_n); var date_f = new Date(date_n);
    var cal_list = [];
    var color_array = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'puple', 'pink'];

    date_p.setDate(date_p.getDate() - date_p.getDate() + 1);
    date_f.setDate(date_f.getDate()
            + (days_in_month - day_of_month + 1));

    var days_from_sunday = date_p.getDay();
    var temp_date = date_p;
    date_p = date_p.toISOString(); date_f = date_f.toISOString();

    // Iterate through selected calendars and get events within specified range
    var date_dict={};
    date_dict['days_from_sunday'] = days_from_sunday;
    while(temp_date.getDate() <= days_in_month){
        date_dict[temp_date.toDateString()] = new Array();
        temp_date.setDate(temp_date.getDate() + 1);
    }
    date_dict[temp_date.toDateString()] = new Array();
    $("#cal_select").css("display", "none");
    for (var i=0; i<cal_array.length; i++) {
        cal_list.push(cal_array[i]);

        (function(i) {
            $.getJSON($SCRIPT_ROOT + '/calendar', {
                c: 'events?orderBy=startTime&singleEvents=true&'+
                    'timeMax='+encodeURIComponent(date_f)+"&timeMin="+encodeURIComponent(date_p)+"&",
                cid: cal_array[i]
            }, function(data) {
                color = color_array[i];
                var resp = JSON.parse(data);

                // Add events to dictionary where key = date, value = list of events for date
                $.each(resp.items, function(j, obj) {
                    if (obj.start != undefined){
                        if (obj.start.date != undefined ) {
                            event_date = new Date(obj.start.date);
                            event_date.setDate(event_date.getDate() + 1);

                        } else {
                            event_date = new Date(obj.start.dateTime);
                        }

                        event_date = event_date.toDateString();
                        if (obj.summary == undefined) { obj.summary = 'Busy'; }
                        date_dict[event_date].push([obj.summary, color]);
                    }
                });
            });
        })(i);
    }

    // Append results to webpage -- Timeout required to allow for all requests to finish
    window.setTimeout(function() {eval_date_list(date_dict, cal_list);}, 2000);
}


// Allows calendar selection
function cal_list_add_css() {
    $("#cal_list li").on('click', function() {
        if ($(this).css('text-decoration-line') == 'underline') {
            $(this).css('text-decoration-line', 'none');
            $(this).css('text-decoration-color', 'rgba(0,0,0,0)');
        } else {
            $(this).css('text-decoration-line', 'underline');
            $(this).css('text-decoration-color', 'rgba(0,0,0,1)');
        }
    });
}

// Appends to webpage
function eval_date_list(date_dict, cal_list){
    // Clear calendar when function is called so that events don't get duplicated on updates
    $("#calendar").empty();

    dates = Object.keys(date_dict);
    var days_from_sunday = date_dict["days_from_sunday"];

    date = new Date();
    month_year = date.toLocaleString("en-us" ,{ month: "long", year: "numeric"});
    week_beginning = date.getDate() - date.getDay();
    week_end = week_beginning + 6;
    color_array = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'puple', 'pink'];

    $("#calendar").append("<div id='cal_header'>"+month_year+"</div>");
    $("#calendar").append("<div id='cal_results_month'></div>");
    $("#calendar").append("<div id='cal_results_week'></div>");
    $("#calendar").append("<div id='cal_results_day'></div>");

    // Add Week header
    $("#cal_results_month, #cal_results_week").append("<div class='day_header'>S</div>"+
            "<div class='day_header'>M</div>"+
            "<div class='day_header'>T</div>"+
            "<div class='day_header'>W</div>"+
            "<div class='day_header'>T</div>"+
            "<div class='day_header'>F</div>"+
            "<div class='day_header'>S</div>");

    // Generate day views
    for (var i = 0; i < days_from_sunday; i++){
        $("#cal_results_month").append("<div class='cal_day'></div>");
    }

    // Populate views
    for (var i = 1; i < dates.length; i++) {
        if (date.toDateString() == dates[i]) {
            $("#cal_results_month").append("<div style='background-color:#202020;' class='cal_day"+i+" cal_day'><h6>"+i+"</h6>");
            $("#cal_results_week").append("<div style='background-color:#202020;' class='cal_day"+i+" cal_day'><h6>"+i+"</h6>");
            $("#cal_results_day").append("<div style='background-color:#202020;' class='cal_day"+i+" cal_day'><h6>"+i+"</h6>");

        } else {
            if (i >= week_beginning && i <= week_end) {
                $("#cal_results_week").append("<div class='cal_day"+i+" cal_day'><h6>"+i+"</h6>");
            }

            $("#cal_results_month").append("<div class='cal_day"+i+" cal_day'><h6>"+i+"</h6>");
        }

        date_dict[dates[i]].forEach(function(e){$(".cal_day"+i).append("<p style='color:"+e[1]+";'>"+e[0]+"</p>");});
    }

    // Show selected calendars
    $("#calendar").append("<div class='used_cal_list'></div>");
    for (var i = 0; i < cal_list.length; i++){
        $(".used_cal_list").append("<p style='color:"+color_array[i]+";'>"+cal_list[i]+'</p>');
    }

    // Fade in calendar on refresh
    window.setTimeout(function() {resize($("#calendar").parent());}, 500);
    if (view_mode == 0) {
        window.setTimeout(function() {$("#cal_results_day").css("opacity", 1);}, 600);
        window.setTimeout(function() {$("#cal_results_month").css("display", "none");}, 400);
        window.setTimeout(function() {$("#cal_results_week").css("display", "none");}, 400);
    } else if (view_mode == 1) {
        window.setTimeout(function() {$("#cal_results_week").css("opacity", 1);}, 600);
        window.setTimeout(function() {$("#cal_results_month").css("display", "none");}, 400);
        window.setTimeout(function() {$("#cal_results_day").css("display", "none");}, 400);
    } else {
        window.setTimeout(function() {$("#cal_results_month").css("opacity", 1);}, 600);
        window.setTimeout(function() {$("#cal_results_week").css("display", "none");}, 400);
        window.setTimeout(function() {$("#cal_results_day").css("display", "none");}, 400);
    }
}
