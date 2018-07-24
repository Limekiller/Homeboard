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
        let cal_array = [];
        $("#cal_list li").each(function(index) {
            if($(this).css('text-decoration-line')=='underline'){
                cal_array.push($(this).attr('name'));
            }
        });
        get_events(cal_array);
        window.setInterval(function(){
            let used_cal_array = [];
            $(".used_cal_list").each(function(index){
                used_cal_array.push($(this)[0].textContent);
            });
            get_events(used_cal_array);
        }, 300000);
    });
}


function get_events(cal_array){
    var date_n = new Date();
    var day_of_month = date_n.getDate();
    var month_of_year = date_n.getMonth();
    var days_in_month = new Date(date_n.getFullYear(), month_of_year, 0).getDate();
    var date_p = new Date(date_n); var date_f = new Date(date_n);
    var cal_list = [];

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

        $.getJSON($SCRIPT_ROOT + '/calendar', {
            c: 'events?orderBy=startTime&singleEvents=true&'+
                'timeMax='+encodeURIComponent(date_f)+"&timeMin="+encodeURIComponent(date_p)+"&",
            cid: cal_array[i]
        }, function(data) {
            var resp = JSON.parse(data);

            // Add events to dictionary where key = date, value = list of events for date
            $.each(resp.items, function(i, obj) {
                if (obj.start != undefined){
                    if (obj.start.date != undefined ) {
                        event_date = new Date(obj.start.date);
                        event_date.setDate(event_date.getDate() + 1);

                    } else {
                        event_date = new Date(obj.start.dateTime);
                    }

                    event_date = event_date.toDateString();
                    date_dict[event_date].push(obj.summary);
                }
            });
        });
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
    $("#calendar").empty();

    date = new Date();
    month_year = date.toLocaleString("en-us" ,{ month: "long", year: "numeric"});

    $("#calendar").append("<div id='cal_header'>"+month_year+"</div>");
    $("#calendar").append("<div id='cal_results'></div>");

    dates = Object.keys(date_dict);
    var days_from_sunday = date_dict["days_from_sunday"];

    $("#cal_results").append("<div class='day_header'>S</div>"+
            "<div class='day_header'>M</div>"+
            "<div class='day_header'>T</div>"+
            "<div class='day_header'>W</div>"+
            "<div class='day_header'>T</div>"+
            "<div class='day_header'>F</div>"+
            "<div class='day_header'>S</div>");

    for (var i = 0; i < days_from_sunday; i++){
        $("#cal_results").append("<div class='cal_day'></div>");
    }

  //  $(".cal_day p").each(function(){
  //      $(this).empty();
  //  });

    for (var i = 1; i < dates.length; i ++) {
        if (date.toDateString() == dates[i]) {
            $("#cal_results").append("<div style='background-color:#202020;' id='cal_day"+i+"' class='cal_day'><h6>"+i+"</h6>");
        } else {
            $("#cal_results").append("<div id='cal_day"+i+"' class='cal_day'><h6>"+i+"</h6>");
        }

        date_dict[dates[i]].forEach(function(e){$("#cal_day"+i).append("<p>"+e+"</p>");});
    }
    for (var i = 0; i < cal_list.length; i++){
        $("#calendar").append("<p class='used_cal_list'>"+cal_list[i]+'</p>');
    }

    window.setTimeout(function() {resize($("#calendar").parent());}, 500);
    window.setTimeout(function() {$("#cal_results").css("opacity", 1);}, 600);
}
