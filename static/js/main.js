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
}