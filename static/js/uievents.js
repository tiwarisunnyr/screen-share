function initUIEvents(action) {
    switch (action) {
        case menuActions.REMOTE:
            initScreenUI()
            break;
        case menuActions.FILE:
            initFileUI();
            break;
        case menuActions.CMD:
            break;
    }
}
