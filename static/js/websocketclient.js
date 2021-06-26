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
                drawScreen(data);
                break;
            case STOP_STREAM:
                clearScreen();
                break;
            case LIST_DRIVE:
                listDrive();
                break;
            default:

                break;
        }
        instance.sendAck();
    };

    this.send = function (msg) {
        instance.conn.send(JSON.stringify(msg))
    };

    this.sendAck = function(){
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