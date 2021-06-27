class FileManagement {
    constructor() {
        let instance = this;
        this.ListDrive = function () {
            wsClient.send({
                type: LIST_DRIVE,
                message: '',
                to: ClientID,
                from: FROM
            });
        };
        this.FetchPath = function () {
            wsClient.send({
                type: FETCH_PATH,
                message: '',
                to: ClientID,
                from: FROM
            });
        };

        this.FillDrives = function (target, data) {
            data.forEach(function (v) {
                console.log(v);
                var addedNode = target.add(null, {
                    caption: v.display,
                    icon: '<span class="mif-folder fg-orange">',
                    content: "<div class='mt-1' data-role='progress' data-value='" + v.percentusage + "' data-small='true'></div><div>" + formatBytes(v.freebytes, 2) + " free of " + formatBytes(v.totalsize, 0) + "</div>",
                });
                $(addedNode).click(function () {
                    console.log(v)
                });
            });
        }
    }
}

