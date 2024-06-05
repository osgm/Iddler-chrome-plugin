chrome.storage.local.get('iddlerSwitch', function (result) {
    iddlerSwitch = result.iddlerSwitch;
    if (iddlerSwitch) {
        console.log("------------------正在监听网络请求------------------");
    }
});