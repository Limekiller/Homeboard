$(document).ready(function() {
    $(".grid-box").each(function(i, obj) {
        window.setTimeout(function(){$(obj).css('opacity', '1');},250+(i*(Math.random()*50)));
    });
});
