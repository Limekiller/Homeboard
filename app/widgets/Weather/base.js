function init(widg_id){

    $('#weather_search').keyup(function(e){
        if (e.keyCode == 13) {
            window.setInterval(function() { getData($("#weather h6").html()); }, 3600000);
            getData($("#weather_search").val());
        }
    });

    var element = document.getElementById('weather');
    new ResizeSensor(element.parentElement, function() {
        if (element.parentElement.clientWidth < 500) {
        }
        else {
        }
    });

}

function getData(city) {
    $.getJSON('https://api.openweathermap.org/data/2.5/weather?q='+city+',us&appid=c5d7afec17c98c3e6b4257976cfcc97d', function(data) {
            console.log(data);
            f_temp = ((data.main.temp - 273.15) * 1.8) + 32;
            var image;
            var id = data.weather[0].id;

            switch (true) {
                case (id < 300):
                    image = 'tstorm.svg';
                    break;
                case (id < 500):
                    image = 'rain.svg';
                    break;
                case (id < 600):
                    image = 'rain2.svg';
                    break;
                case (id < 700):
                    image = 'snow.svg';
                    break;
                case (id < 800):
                    image = 'cloud.svg';
                    break;
                case (id == 800):
                    image = 'sun.svg';
                    break;
                case (id < 900):
                    image = 'cloud.svg';
                    break;
            }

            $("#weather").html(
                    "<h1>"+f_temp.toPrecision(3)+"</h1>"+
                    "<img src='widget/Weather/"+image+"' />"+
                    "<h4>"+data.weather[0].description+"</h4>"+
                    "<h6>"+data.name+"</h6>");
    });
    resize($("#weather").parent());
}
