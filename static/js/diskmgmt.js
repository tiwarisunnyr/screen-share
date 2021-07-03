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
        this.currentDirectory = '';
        this.isFetching = false;
        this.pathIndex = -1;
        this.pathArr = [];
        this.UIBackButton;
        this.UIForwardButton;
        this.UIWindowsPath;
        this.UIChangeView;
        this.fileManagement = new FileManagement();
    }

    InitializeFileManager() {
        this.UIBackButton = $('#windowBack');
        this.UIForwardButton = $('#windowNxt');
        this.UIWindowsPath = $('#windowPath');
        this.UIChangeView = $('.change-view');

        this.fileManagement.ListDrive();
        this.BindEvents();
    }

    FetchPath(path) {
        if (this.isFetching)
            return;

        if ($.inArray(path, this.pathArr) == -1) {
            this.pathIndex++;
            this.pathArr.push(path);
        }
        this.fileManagement.FetchPath(path);
        this.isFetching = true;
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
                instance.pathArr = [];
                instance.pathIndex = -1;
                instance.currentDirectory = v.mountpoint + '\\';
                instance.FetchPath(instance.currentDirectory);
            });
        });
    }

    FillDirectories(data) {
        var instance = this;
        var ulfileInfo = Metro.getPlugin('#lstfileInfo', 'listview');
        $('#lstfileInfo').empty();
        this.UIAddressBarElement();
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
                    if (instance.pathIndex < instance.pathArr.length - 1) {
                        console.log(instance.pathIndex, instance.pathArr);
                        instance.pathArr.splice(instance.pathIndex + 1)
                    }
                    instance.currentDirectory += v.filename + '\\';
                    instance.FetchPath(instance.currentDirectory);
                }
                console.log(instance.pathArr);                
            });
        });

        if (this.pathIndex > 0) {
            this.UIBackButton.removeClass("fg-gray").addClass('fg-blue')
        }

        this.isFetching = false;
    }

    ShowInfo(data, sender, inplace) {
        var fileInfo = `Name : ${data.filename}
            <br>Type : ${(data.isdir ? 'File Folder' : 'File')}
            <br>Size : ${(data.isdir ? 0 : formatBytes(data.size))}`;

        //if (inplace)
        //    $('#fDetails').html(fileInfo);

        $(sender).attr('title', fileInfo.split('<br>').join('\n'));
    }

    BindUIBackButtonClick() {
        let instance = this;

        $(this.UIBackButton).click(function (e) {

            if (instance.isFetching || instance.pathIndex <= 0)
                return;

            instance.pathIndex--;
            instance.currentDirectory = instance.pathArr[instance.pathIndex];
            instance.FetchPath(instance.currentDirectory);
            instance.UIForwardButton.addClass('fg-blue').removeClass('fg-gray');
            if (instance.pathIndex <= 0) {
                instance.UIBackButton.removeClass('fg-blue').addClass('fg-gray');
            }
            instance.isFetching = true;
        });
    }

    BindUIForwardButtonClick() {
        let instance = this;

        $(this.UIForwardButton).click(function (e) {
            if (instance.isFetching || instance.pathIndex === instance.pathArr.length - 1)
                return;

            instance.pathIndex++;
            instance.UIBackButton.addClass('fg-blue').removeClass('fg-gray');
            instance.currentDirectory = instance.pathArr[instance.pathIndex];
            instance.FetchPath(instance.currentDirectory);
            if (instance.pathIndex === instance.pathArr.length - 1) {
                instance.UIForwardButton.removeClass('fg-blue').addClass('fg-gray')
            }
            instance.isFetching = true;
        });
    }

    BindChangeView() {
        $(this.UIChangeView).click(function (e) {
            var newView = $(e.currentTarget).attr('data-view');
            $("#lstfileInfo").data("listview").view(newView);
        });
    }

    UIAddressBarElement() {
        this.UIWindowsPath.html('');
        var curPathArr = this.currentDirectory.split('\\');
        var pathContent = curPathArr.map(function (v) {
            if (v === "")
                return '';
            var linkContainer = $('<div>')
            var aPath = $('<a href="#">');
            aPath.html(`<span>${v}</span>`)
            linkContainer.append(aPath)
            linkContainer.append('&nbsp;<i class="fa fa-caret-right"></i>&nbsp;')
            return linkContainer;
        });
        this.UIWindowsPath.append(pathContent);
    }

    BindEvents() {
        this.BindChangeView();
        this.BindUIBackButtonClick();
        this.BindUIForwardButtonClick();
        this.UIAddressBarElement();
    }
}
