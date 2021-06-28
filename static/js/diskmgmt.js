class FileManagement {
    constructor() {
        let instance = this;
        instance.currentDirectory = '';
        this.ListDrive = function () {
            wsClient.send({
                type: LIST_DRIVE,
                message: '',
                to: ClientID,
                from: FROM
            });
        };
        this.FetchPath = function (path) {
            wsClient.send({
                type: FETCH_PATH,
                message: path,
                to: ClientID,
                from: FROM
            });
        };

        this.FillDrives = function (target, data) {
            data.forEach(function (v) {
                //console.log(v);
                var addedNode = target.add(null, {
                    caption: v.display,
                    icon: '<span class="mif-drive fg-orange">',
                    content: "<div class='mt-1' data-role='progress' data-value='" + v.percentusage + "' data-small='true'></div><div>" + formatBytes(v.freebytes, 2) + " free of " + formatBytes(v.totalsize, 0) + "</div>",
                });
                $(addedNode).click(function () {
                    instance.currentDirectory = v.mountpoint + '\\';
                    instance.FetchPath(instance.currentDirectory);
                });
            });
        }
        this.FillDirectories = function (data) {
            var ulfileInfo = Metro.getPlugin('#lstfileInfo', 'listview');
            $('#lstfileInfo').empty();
            data.forEach(function (v) {
                //console.log(v);
                var addedNode = ulfileInfo.add(null, {
                    caption: v.filename,
                    icon: '<span class="fa fa-' + (v.isdir ? 'folder fg-orange' : 'file fg-blue') + '">',
                    //content: "<div>" + v.filename + "</div>",
                });
                $(addedNode).dblclick(function () {
                    if (v.isdir) {
                        instance.currentDirectory += v.filename + '\\';
                        instance.FetchPath(instance.currentDirectory);
                    }
                });
            });
        }
    }
}

