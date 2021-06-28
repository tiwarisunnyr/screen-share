var ctx, viewer, ClientID = '';

//initScreenUI();
//initConnection();
function initScreenUI() {
    viewer = document.getElementById("viewer");
    ctx = viewer.getContext("2d");

    $('.refresh').click(function () {
        //wsClient.reInitConnection();
    });
    $('.start').click(function () {
        remoteObject.startStream();
    });
    $('.stop').click(function () {
        remoteObject.stopStream();
    });
}

function initFileUI(){
    fileManagement.ListDrive();
    $('.change-view').click(function () {
        var __view = $(this).attr('data-view');
        $('.change-view').removeClass('bg-orange');
        $(this).addClass('bg-orange');
        $("#lstfileInfo").data("listview").view(__view);
    });
}