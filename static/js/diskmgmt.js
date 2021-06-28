class FileManagement {
    constructor() {

    }
    ListDrive() {
        wsClient.send({
            type: LIST_DRIVE,
            message: '',
            to: ClientID,
            from: FROM
        });
    };

    FetchPath(path) {
        wsClient.send({
            type: FETCH_PATH,
            message: path,
            to: ClientID,
            from: FROM
        });
    };
}

class FileManagementUI {

    constructor() {
        //this.instance = this;
        this.currentDirectory = '';
        this.isFetching = false;
        this.pathIndex = -1;
        this.pathArr = [];
        this.UIBackButton = $('#windowBack');
        this.UIForwardButton = $('#windowNxt');
        this.UIWindowsPath = $('#windowPath');
        this.fileManagement = new FileManagement();
    }

    ListDrive() {
        this.fileManagement.ListDrive();
    }

    FillDrives(data) {
        var instance = this;
        var target = Metro.getPlugin('#localdrives', 'listview')
        data.forEach(function (v) {
            var addedNode = target.add(null, {
                caption: v.display,
                icon: '<span class="mif-drive fg-orange">',
                content: "<div class='mt-1' data-role='progress' data-value='" + v.percentusage + "' data-small='true'></div><div>" + formatBytes(v.freebytes, 2) + " free of " + formatBytes(v.totalsize, 0) + "</div>",
            });
            $(addedNode).click(function () {
                instance.currentDirectory = v.mountpoint + '\\';
                instance.fileManagement.FetchPath(instance.currentDirectory);
            });
        });
    }

    FillDirectories(data) {
        var instance = this;
        var ulfileInfo = Metro.getPlugin('#lstfileInfo', 'listview');
        $('#lstfileInfo').empty();
        data.forEach(function (v) {
            var addedNode = ulfileInfo.add(null, {
                caption: v.filename,
                icon: '<span class="fa fa-' + (v.isdir ? 'folder fg-orange' : 'file fg-blue') + '">',
            });

            $(addedNode[0]).attr('data-modified', v.modified);
            $(addedNode[0]).attr('data-size', v.size);

            addedNode[0].onclick = function () {
                instance.ShowInfo(v, this, true);
            }
            addedNode[0].onmouseover = function () {
                instance.ShowInfo(v, this, true);
            }

            $(addedNode).dblclick(function () {
                if (v.isdir) {
                    instance.currentDirectory += v.filename + '\\';
                    instance.fileManagement.FetchPath(instance.currentDirectory);
                }
            });
        });
    }

    ShowInfo(data, sender, inplace) {
        var __html = "Name : " + data.filename;
        __html += '<br>Type : ' + (data.isdir ? 'File Folder' : 'File');
        __html += '<br>Size : ' + (data.isdir ? 0 : formatBytes(data.size));

        //if (inplace)
        //    $('#fDetails').html(__html);

        $(sender).attr('title', __html.split('<br>').join('\n'));
    }

    UIBackButtonClick() {
        if (this.isFetching)
            return;
        if (this.pathIndex === 0) {
            return false;
        }
        this.pathIndex--;
        this.currentDirectory = pathArr[instance.pathIndex];
        this.fileManagement.FetchPath(instance.currentDirectory);
        $($windowNxt).addClass('fg-blue');
        $($windowNxt).removeClass('fg-gray');
        this.isFetching = true;
    }

    UIForwardButtonClick() {
        if (this.isFetching)
            return;
        if (this.pathIndex === this.pathArr.length - 1) {
            return false;
        }
        this.pathIndex++;
        $($windowBack).addClass('fg-blue');
        $($windowBack).removeClass('fg-gray');
        this.currentDirectory = pathArr[this.pathIndex];
        this.fileManagement.FetchPath(this.currentDirectory);
        this.isFetching = true;
    }
}
