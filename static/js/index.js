let wsClient = new WebSocketClient();

$(function(){
    var hash = location.hash;
    var target = hash.length > 0 ? hash.substr(1) : "dashboard";
    var link = $(".navview-menu a[href*="+target+"]");
    var menu = link.closest("ul[data-role=dropdown]");
    var node = link.parent("li").addClass("active");

    
    wsClient.initConnection(); //create websocket connection

    function getContent(target){
        window.on_page_functions = [];
        $.get('/pages/'+target + ".html?"+$.now()).then(
            function(response){
                $("#content-wrapper").html(response);
                initUIEvents(target);
            }
        );
    }

    getContent(target);

    $(".navview-menu").on(Metro.events.click, "a", function(e){
        var href = $(this).attr("href");
        var pane = $(this).closest(".navview-pane");
        var hash;

        hash = href.substr(1);
        href = hash + ".html";

        getContent(hash);

        if (pane.hasClass("open")) {
            pane.removeClass("open");
        }

        pane.find("li").removeClass("active");
        $(this).closest("li").addClass("active");

        return false;
    });    
});