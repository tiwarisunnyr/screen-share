var DRAW_IMAGE = true;
//const refRes = { width: 1200, height: 1200 };

function drawScreen(data) {
    DRAW_IMAGE = true;
    if (DRAW_IMAGE) {

        /*var scale = Math.min(viewer.width / refRes.width, viewer.height / refRes.height);

        // set the origin so that the scaled content is centered on the canvas
        var origin = {
            x: (viewer.width - refRes.width * scale) / 2,
            y: (viewer.height - refRes.height * scale) / 2
        };

        // Set the transform to scale and center on canvas
        ctx.setTransform(scale, 0, 0, scale, 0, 0);

        // Then render your content using the original coordinates.
        ctx.fillRect(0, 0, refRes.w, refRes.height); // will fit any sized canvas*/


        var img64 = new Image();
        img64.onload = function () {
            viewer.width = img64.width;
            viewer.height = img64.height;
            ctx.drawImage(img64, 0, 0);
        };
        img64.src = `data:image/png;base64,${data.message}`;
    }
}

function clearScreen() {
    DRAW_IMAGE = false;
    setTimeout(() => {
        ctx.clearRect(0, 0, viewer.width, viewer.height);
    }, 500);
}

function startStream() {
    wsClient.send({
        type: START_STREAM,
        message: '',
        to: ClientID,
        from: FROM
    });
}

function stopStream() {
    wsClient.send({
        type: STOP_STREAM,
        message: '',
        to: ClientID,
        from: FROM
    });
}