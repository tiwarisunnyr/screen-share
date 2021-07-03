var ctx, viewer, ClientID = '';

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

function initFileUI() {
    fileManagementUI.InitializeFileManager();
}