function init(widg_id){

    getNews();
    window.setInterval(function() { getNews(); }, 10000);

    var element = document.getElementById('news');
    new ResizeSensor(element.parentElement, function() {
        if (element.parentElement.clientWidth < 500) {
        }
        else {
        }
    });
}

function getNews(){
    $.getJSON('https://newsapi.org/v2/top-headlines?country=us&apiKey=1c56c8c525e243ae90c7a2039082f5f1', function(data) {
        $("#news #results").html('');
        for (var i = 0; i < 5; i++){
            $("#news #results").append(
                    "<h3>"+data.articles[i].source.name+"</h3>"+
                    "<h1>"+data.articles[i].title+"</h1>");
            if (i < 4) {
                $("#news #results").append("<hr />");
            }
        }
        resize($("#news").parent());
    });
}
