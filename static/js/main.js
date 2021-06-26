var ctx, viewer, ClientID = '';

//initScreenUI();
//initConnection();

function initScreenUI() {
    viewer = document.getElementById("viewer");
    ctx = viewer.getContext("2d");

    $('.refresh').click(function () {
        wsClient.reInitConnection();
    });
    $('.start').click(function () {
        startStream()
    });
    $('.stop').click(function () {
        stopStream();
    });
}