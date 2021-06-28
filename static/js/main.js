var ctx, viewer, ClientID = '';

var isFetching = false;
var $windowBack = $('#windowBack');
var $windowNxt = $('#windowNxt');
var __dirIndex = -1;
var __pathArr = [];

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

function initFileUI() {
    fileManagementUI.ListDrive();

    $('.change-view').click(function () {
        var __view = $(this).attr('data-view');
        $('.change-view').removeClass('bg-orange');
        $(this).addClass('bg-orange');
        $("#lstfileInfo").data("listview").view(__view);
    });

    $($windowBack)
        .click(function () {
            fileManagement.UIBackButtonClick()
            return false;
        });
    $($windowNxt).click(function () {
        fileManagement.UIForwardButtonClick();
        return false;
    });
}