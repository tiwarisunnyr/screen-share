function WebSocketClient() {
    this.conn = undefined;
    let instance = this;

    this.initConnection = function () {
        instance.conn = new WebSocket("ws://" + document.location.host + "/ws");
        instance.conn.onclose = function (evt) {
            console.log("Connection Closed", evt);
        };
        instance.conn.onmessage = instance.handleEvents;
    };

    this.handleEvents = function (evt) {
        var data = JSON.parse(evt.data);
        switch (data.type) {
            case INIT_CONNECTION:
                ClientID = data.message;
                break;
            case READY_STREAM:
                console.log("Already Running")
                break;
            case START_STREAM:
                remoteObject.drawScreen(ctx, data);
                break;
            case STOP_STREAM:
                remoteObject.clearScreen(ctx);
                break;
            case LIST_DRIVE:
                fileManagement.FillDrives(Metro.getPlugin('#localdrives', 'listview'), JSON.parse(data.message));
                break;
            case FETCH_PATH:
                fileManagement.FillDirectories(JSON.parse(data.message))
                break;
            default:

                break;
        }
        //instance.sendAck();
    };

    this.send = function (msg) {
        instance.conn.send(JSON.stringify(msg))
    };

    this.sendAck = function () {
        instance.conn.send(JSON.stringify({
            type: ACK_RESPONSE,
            message: '',
            to: ClientID,
            from: FROM
        }))
    };

    this.reInitConnection = function () {
        if (instance.conn) {
            clearScreen();
            //Close prev connection if exists
            instance.conn.close();
        }
        instance.initConnection()
    }
}