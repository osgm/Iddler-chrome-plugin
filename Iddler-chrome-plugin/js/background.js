let dataflag = true;
let dataType = false;
let iddlerSwitch = true;
var ignoreList = [
            'http://hm.baidu.com/',
            'http://push.zhanzhang.baidu.com/',
            'http://api.share.baidu.com/'
];

chrome.storage.local.get('iddlerSwitch', function (result) {
    iddlerSwitch = result.iddlerSwitch;
    console.info(iddlerSwitch)
    try {
    if (iddlerSwitch) {
        // 如果iddlerSwitch为true，则显示span元素
        document.querySelector('#listeningStop').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
        document.querySelector('#listeningCrawl').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
        document.querySelector('#start').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
        document.querySelector('#stop').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求

    } else {
        document.querySelector('#listeningStop').style.display = 'inline';
        document.querySelector('#listeningCrawl').style.display = 'none';
        document.querySelector('#start').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
        document.querySelector('#stop').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
    }
    } catch {
        }
});

function testBackground() {
    alert("你好，我是background！");
}

$("#start").click((e) => {
    chrome.storage.local.set({iddlerSwitch: false}, function () {
            chrome.storage.local.get('iddlerSwitch', function (result) {
             console.info(result)
            });
        });
    document.querySelector('#listeningStop').style.display = 'inline';
    document.querySelector('#listeningCrawl').style.display = 'none';
    document.querySelector('#stop').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
    document.querySelector('#start').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
    chrome.storage.local.get('iddlerSwitch', function (result) {console.info(result)})

});

$("#stop").click((e) => {
    chrome.storage.local.set({iddlerSwitch: true}, function () {
            chrome.storage.local.get('iddlerSwitch', function (result) {
             console.info(result)
            });
        });
    document.querySelector('#listeningStop').style.display = 'none';
    document.querySelector('#listeningCrawl').style.display = 'inline';
    document.querySelector('#stop').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
    document.querySelector('#start').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
    chrome.storage.local.get('iddlerSwitch', function (result) {console.info(result)})


});

//参数替换
$("#reps").click((e) => {
    const from = document.getElementById('get_from').value;
    const to = document.getElementById('get_to').value;
    console.info(from)
    console.info(to)
    reps_table_data(from,to)
});

//脚本导出
$("#export").click((e) => {
    // 使用方法
    export_data().then(value => {
        console.log('Value from IndexedDB:', value);
        const name = "测试用例"
        this.downloadPostman(name ,value)
    }).catch(error => {
        console.error('Error fetching value:', error);
        alert("导出数据异常！！")
    });
});

$("#get_data").click((e) => {
    dataflag = true;
    dataType = false;
    get_data(dataflag, dataType);
});
$("#get_Xhr").click((e) => {
    dataType = ['xhr', 'fetch'];
    get_data(dataflag, dataType);
});
$("#get_Doc").click((e) => {
    dataType = ['document', 'preflight'];
    get_data(dataflag, dataType);
});
$("#get_Css").click((e) => {
    dataType = ['stylesheet', 'font'];
    get_data(dataflag, dataType);
});
$("#get_Js").click((e) => {
    dataType = ['script'];
    get_data(dataflag, dataType);
});
$("#get_Img").click((e) => {
    dataType = ['image'];
    get_data(dataflag, dataType);
});
$("#get_Media").click((e) => {
    dataType = false;
    get_data(dataflag);
});
$("#get_Manifest").click((e) => {
    dataType = false;

    get_data(dataflag);
});
$("#get_WS").click((e) => {
    dataType = ['websocket'];

    get_data(dataflag, dataType);
});
$("#get_Wasm").click((e) => {
    dataType = false;
    get_data(dataflag, dataType);
});
$("#get_Other").click((e) => {
    dataType = ['other'];
    get_data(dataflag, dataType);
});
$("#get_data_last").click((e) => {
    dataflag = false;
    dataType = false;
    get_data(dataflag);
});

$("#clear_data").click((e) => {
    clear_data();
});
$("#del_data").click((e) => {
    console.log(e);
    del_data();
});
const db_version = 1;

function clear_data() {
    Toast('清除缓存', '成功')
    let tbody = document.getElementById("tbody"); // 获取表格的tbody元素
    tbody.innerHTML = "";
    var numElement = document.getElementById("num");
    numElement.innerHTML = 0;
}

function del_data() {
    // 检查数据库是否存在并删除
    clear_data();
    const request = indexedDB.open("myDatabase", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        const store = transaction.objectStore("myDataStore");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;
            console.log(cursor);
            if (cursor) {
                // 为当前数据创建一个新的表格行
                cursor.delete();
                console.log("记录已删除:", cursor.value);
                // 继续移动游标到下一个记录
                cursor.continue();
            } else {
                // 所有记录都已处理完毕
                console.log("没有更多数据了！");
            }
        };

        cursorRequest.onerror = function (event) {
            console.error("读取数据时发生错误:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}

let lc = 1;

function get_data(e, getType = null,reps={key:'',value:''}) {

    lc = 0;
    var numElement = document.getElementById("num");
    numElement.innerHTML = 0;
    var searchValue = search()
    let tbody = document.getElementById("tbody"); // 获取表格的tbody元素
    tbody.innerHTML = "";
    const request = indexedDB.open("myDatabase", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        var store = transaction.objectStore("myDataStore");
        var cursorRequest = null;
        if (e) {
            cursorRequest = store.openCursor();
        } else {
            cursorRequest = store.openCursor(null, "prev");
        }
        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
            //替换变量更新数据
            //替换所有的请求内容的变量
            //从返回值按顺序查，如果找到了，标记接口并替换
            valueStr = JSON.stringify(cursor.value)
            contentStr=cursor.value.content
            responseStr = JSON.stringify(cursor.value.response)
            if (searchValue == false) {
                if(reps.key !='' && reps.value != '' ){
                    cursor.value.api_name ="未定义接口:"
                    if(responseStr !="" && responseStr != undefined ){
                        if(responseStr.includes(reps.key)){
                            cursor.value.content=cursor.value.content.replace(reps.key,reps.value).toString()
                            cursor.value.api_name =cursor.value.api_name+"提取"+JSON.stringify(reps.value)
                            }
                    }

                    if(contentStr !="" && contentStr != undefined ){
                        if(contentStr.includes(reps.key)){
                        cursor.value.content=cursor.value.content.replace(reps.key,reps.value).toString()
                        cursor.value.api_name =cursor.value.api_name+"提取"+JSON.stringify(reps.value)
                        }
                    }

                    Object.keys(cursor.value.request.headers).forEach(key => {
                        cursor.value.request.headers[key].value=cursor.value.request.headers[key].value.replace(reps.key,reps.value).toString()
                    })

                    Object.keys(cursor.value.request.queryString).forEach(key => {
                        cursor.value.request.queryString[key].value=cursor.value.request.queryString[key].value.replace(reps.key,reps.value).toString()
                    })
                    if( cursor.value.request.hasOwnProperty("postData") ){
                        if(cursor.value.request.postData.mimeType.includes('multipart/form-data')){
                            Object.keys(cursor.value.request.postData.params).forEach(key => {
                                cursor.value.request.postData.params[key].value=cursor.value.request.postData.params[key].value.replace(reps.key,reps.value).toString()
                            })
                    }else{
                        cursor.value.request.postData.text =cursor.value.request.postData.text.replace(reps.key,reps.value).toString()
                    }
                    }

                    cursor.value.request.url=cursor.value.request.url.replace(reps.key,reps.value).toString()
                    store.put(cursor.value)
            }

            make_data(cursor, getType)


            } else {
                if (valueStr.includes(searchValue)) {
                cursor.value.name ="未定义名称接口"
                make_data(cursor, getType)
                } else {
                    }
                }
            cursor.continue();
            } else {
                // 所有记录都已处理完毕
                console.log("没有更多数据了！");
                const uniqueArray = [...new Set(typeMap)];
                console.log(uniqueArray);
            }

        };

        cursorRequest.onerror = function (event) {
            console.error("读取数据时发生错误:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}

let typeMap = [];

function make_data(cursor, getType) {

    const htmlString = cursor.value.content;
    var api_name = cursor.value.api_name;
    if(api_name ==undefined ||api_name =='' ){
        api_name="未定义接口:"
    }
    const url = cursor.value.request.url;
    const resourceType = cursor.value._resourceType;
    const httpVersion = cursor.value.request.httpVersion;
    const status = cursor.value.response.status;
    const method = cursor.value.request.method;
    const bodySize = cursor.value.response.content.size;
    var bodydata = "";
    try {
        bodydata = cursor.value.request.postData.text.replace(reps.key,reps.value);

    } catch {
    }

    if (getType) {
        if (!(getType.includes(resourceType))) {
            return
        }
    }

    // 为当前数据创建一个新的表格行
    const row = tbody.insertRow();
    row.insertCell().innerHTML = `<td class="Incheckbox"><input style="width: 15px;height: 15px" type="checkbox" class="select-checkbox" pid="${cursor.value.id}"></td>`;
    row.insertCell().innerHTML = `<td style="width: 10px;">${lc}</td>`;
        row.insertCell().innerHTML = `<td style="width: 10px;">${api_name}</td>`;
    row.insertCell().innerHTML = `<td><div style="width: 50px">
${get_time(cursor.value.timestamp)}
</div></td>`;
    row.insertCell().innerHTML = `<td><div style="width: 50px">${httpVersion}</div></td>`;
    row.insertCell().textContent = method;
    // row.insertCell().innerHTML = `<td style="background-color: green; width: 50px">${extractDomain(url)}</td>`;
    docDomain(row, extractDomain(url))
    urlParse(url, resourceType, row, cursor);
    row.insertCell().innerHTML = `<td>${status}</td>`;
    row.insertCell().textContent = bodySize;
    typeMap.push(resourceType);
    if (resourceType == "image" && htmlString) {
        var img = document.createElement("img");
        if (htmlString.startsWith('data:') || htmlString.startsWith('<?xml')) {
            img.src = htmlString; // 设置图片源为Base64字符串
        } else {
            img.src = "data:image/png;base64," + htmlString; // 设置图片源为Base64字符串
        }
        img.alt = "Base64 Image"; // 设置图片的替代文本
        if (htmlString.startsWith('<?xml')) {
            row.insertCell().innerHTML = `<div style="max-width: 80px;">${htmlString}</div>`;
        } else {
            row.insertCell().innerHTML = `<div style="max-width: 80px;"><img style="max-width: 80px; max-height: 100px;" src="data:image/png;base64,${htmlString}" alt="Base64 Image"></div>`;
        }
    } else {
        row.insertCell().textContent = resourceType;
    }
    // row.insertCell().innerHTML  = action();

    lc = lc + 1;
    var numElement = document.getElementById("num");
    numElement.innerHTML = lc;
    row.querySelector('td').addEventListener('click', function (event) {
        const checkbox = this.querySelector('.select-checkbox');
        checkbox.checked = !checkbox.checked;
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            container: "body",
            height: 100,
        });
    });
}

function get_time(timestamp) {
    // 假设我们有一个时间戳
    timestamp = Number(timestamp);
    // 使用 toISOString 方法转换为 ISO 格式的字符串
    var isoString = new Date(timestamp).toISOString();

    // 截取我们需要的部分，去掉 'Z' 表示的 UTC 时区
    var formattedDate = isoString.slice(0, -1).replace(/T/, " ");

    // 输出结果
    return formattedDate;
}

function truncatedUrl(url) {
    const maxNum = 80;
    const minNum = 40;
    if (url && url.length > maxNum) {
        // 截取前30位和后30位，中间用...连接
        return (
            url.substring(0, minNum) + "..." + url.substring(url.length - minNum)
        );
    }
    return url;
}

function ModalAction(action) {
    var rowData = action;
    console.log(rowData.id);
    db_search(rowData.id, function (result) {
        if (result) {
            console.log("Data retrieved:");
            // // 使用行数据填充模态框
            GeneralModalBody(result);
            ParamsModalBody(result);
            HeadersModel(result.request.headers);
            RespHeadersModel(result.response.headers)
            ResponseModalBody(result);
        } else {
            console.log("No data or error occurred.");
        }
    });
    // 显示模态框
    $("#exampleModal").modal("show");
}

function GeneralModalBody(Data) {
    var ModalBody = document.getElementById("GeneralModalBody");
    ModalBody.innerHTML = `
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Request URL:</div> <div style="color: blue"> ${Data.request.url}</div></div>
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Request MethodL:</div><div style="color: red"> ${Data.request.method}</div></div>
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Status Code:</div> <div style="color: green"> ${Data.response.status}</div></div>
  `;
}

function ResponseModalBody(Data) {
    PreviewModalBody(Data);
    ActionModalBody(Data)
    var ModalBody = document.getElementById("ResponseModalBody");
    ModalBody.textContent = Data.content || "";
}

function ActionModalBody(Data) {
    var ModalBody = document.getElementById("ActionModalBody");
    var curlData = curlApi(Data.request)
    ModalBody.innerHTML = `<button type="button" class="btn btn-outline-success" id="crul${Data.id}">Curl</button>`;
    var curlButton = document.getElementById(`crul${Data.id}`);
    curlButton.addEventListener('click', function () {
        // 调用copyApi函数，并传递所需的参数
        copyApi(curlData);
    });

}

function PreviewModalBody(Data) {
    const resourceType = Data._resourceType;
    var ModalBody = document.getElementById("PreviewModalBody");
    ModalBody.textContent = "";
    var htmlString = Data.content || "";
    if (resourceType == "document") {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, "text/html");
        var bodyContent = doc.body.innerHTML;
        var div = document.createElement("div");
        div.innerHTML = bodyContent;
        ModalBody.appendChild(div);
    } else if (resourceType == "image") {
        var img = document.createElement("img");
        if (htmlString.startsWith('data:')) {
            img.src = htmlString; // 设置图片源为Base64字符串
        } else {
            img.src = "data:image/png;base64," + htmlString; // 设置图片源为Base64字符串
        }
        if (htmlString.startsWith('<?xml')) {
            ModalBody.innerHTML = `<div style="max-width: 80px;">${htmlString}</div>`;
        } else {
            img.alt = "Base64 Image";
            try {
                ModalBody.appendChild(img);
            } catch {
                ModalBody.textContent = Data.content;
            }
        }

    } else {
        try {
            var jsonData = JSON.parse(htmlString);
            jsoneditorApi(jsonData, 'PreviewModalBody')
        } catch {
            ModalBody.textContent = Data.content;
        }
    }
}

function ParamsModalBody(Data) {
    var ParamsBody = document.getElementById("ParamsModalBody");
    var DataBody = document.getElementById("DataModalBody");
    ParamsBody.textContent = ""
    DataBody.textContent = ""
    try {
        ParamsBody.textContent = param_to_string(Data.request.queryString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
    try {
        var htmlString = Data.request.postData.text;
        try {
            var jsonData = JSON.parse(htmlString);
            jsoneditorApi(jsonData, 'DataModalBody')
        } catch {
            DataBody.textContent = htmlString;
        }
    } catch {
    }
}

function HeadersModel(Data) {
    var ModalBody = document.getElementById("HeadersModalBody");
    ModalBody.innerHTML = "";
    Data.forEach((item, index) => {
        ModalBody.appendChild(document.createElement("div")).innerHTML = `
    <div style="
    display: flex;
    align-items: center;
    font-size: 13px;
    ">
      <div style="min-width: 20%;">${item.name.replace(/^:/, "")}:</div>
      <div>${item.value}</div>
    </div>
    `;
    });
}

function RespHeadersModel(Data) {
    var ModalBody = document.getElementById("RespHeadersModalBody");
    ModalBody.innerHTML = "";
    Data.forEach((item, index) => {
        ModalBody.appendChild(document.createElement("div")).innerHTML = `
    <div style="
    display: flex;
    align-items: center;
    font-size: 13px;
    ">
      <div style="min-width: 20%;">${item.name.replace(/^:/, "")}:</div>
      <div>${item.value}</div>
    </div>
    `;
    });
}

function extractDomain(url) {
    // 正则表达式匹配 URL 中的域名部分
    var domainPattern = /[^:\/?#]+:\/\/([^\/?#:]+)[^\/?#:]*/;
    var match = url.match(domainPattern);
    if (!url.startsWith("http")) {
        return "";
    }
    if (match && match[1]) {
        // 如果匹配成功，返回域名部分
        return match[1];
    }

    // 如果不是有效的 URL 或匹配失败，返回空字符串
    return "";
}

function db_search(idToSearch, callback) {
    const request = indexedDB.open("myDatabase", db_version);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // 检查对象存储是否存在，如果不存在则创建它
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully with version: ", db.version);

        // 执行查询操作
        const transaction = db.transaction("myDataStore", "readonly");
        const objectStore = transaction.objectStore("myDataStore");

        // 创建一个请求来获取指定id的数据
        const getRequest = objectStore.get(idToSearch);

        getRequest.onsuccess = function () {
            if (getRequest.result) {
                callback(getRequest.result);
            } else {
                console.log("No data found with id: ", idToSearch);
                callback(null);
            }
        };

        getRequest.onerror = function (event) {
            console.error(
                "Error occurred while retrieving data: ",
                event.target.errorCode
            );
        };
    };

    request.onerror = function (event) {
        console.error("Error opening database: ", event.target.errorCode);
    };
}

$(document).ready(function () {
    // 监听collapse的show和hide事件
    $("#Headerscollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#toggleIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#toggleIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
    $("#Generalcollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#GeneralIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#GeneralIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
    $("#RespHeaderscollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#ResptoggleIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#ResptoggleIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
});

function search() {
    const inputElement = document.getElementById('search');
    const inputValue = inputElement.value.trim() || false;
    return inputValue
}

function docDomain(row, data) {
    var div = document.createElement('td');
    div.innerHTML = `<div style="width: 100px; word-wrap: break-word;">${data}</div>`;
    row.appendChild(div)
}

function urlParse(url, resourceType, row, cursor) {
    map = {
        "script": '#FF1744',
        "image": 'gray',
        "document": 'green',
        "xhr": 'blue',
        "stylesheet": '#424242',
    }
    var colorStr = map[resourceType] || 'blue';
    var div = document.createElement('td');
    var p = document.createElement('p');

    p.setAttribute('data-toggle', 'tooltip');
    p.setAttribute('data-placement', 'top');
    p.setAttribute('title', url); // 假设url是有效的URL字符串
    p.style.color = colorStr;
    p.style.fontSize = '16px';
    p.innerHTML = truncatedUrl(url); // 设置p元素的innerHTML为截断后的URL

    // 将p元素添加到div中
    div.appendChild(p);

    // 将当前行的数据添加到div的data属性中
    div.dataset.row = JSON.stringify({id: cursor.value.id});

    // 为div添加点击事件监听器
    div.addEventListener("click", function () {
        ModalAction(JSON.parse(div.dataset.row)); // 传递行数据给ModalAction函数
    });
    row.appendChild(div)
}

function param_to_string(data) {
    var param = new URLSearchParams();

    // 遍历数据数组，将每一项添加到URLSearchParams对象中
    data.forEach(item => {
        param.append(item.name, item.value);
    });

    return param.toString();
}


$(function () {
    $("#Headerscollapse").collapse({
        toggle: true,
    });
    $("#RespHeaderscollapse").collapse({
        toggle: true,
    });
    $("#Generalcollapse").collapse({
        toggle: true,
    });
});
let ctrlPressed = false;
let shiftPressed = false;
let lastKeyPress = null;
document.addEventListener("keydown", function (event) {
    // 检查是否同时按下了Ctrl和X
    if (event.key === 'Control' || event.key === 'ControlLeft') {
        ctrlPressed = true;
    } else if (event.key === 'Shift' || event.key === 'ShiftLeft') {
        shiftPressed = true;
    }

    // 如果按下了 X 键，并且 Ctrl 和 Shift 都已被按下
    if (event.key === 'x' || event.key === 'X') {
        if (ctrlPressed && shiftPressed) {
            // 执行特定函数
            del_data();
        }
        lastKeyPress = event.key;
    }

    // 重置状态
    if (event.key === lastKeyPress) {
        ctrlPressed = false;
        shiftPressed = false;
    }
});

function jsoneditorApi(initialJson, bid) {
    const container = document.getElementById(bid)
    container.innerText = ''
    const options = {
        'mode': 'code',
        'enableTransform': false,
    }
    const editor = new JSONEditor(container, options)
    editor.set(initialJson)
}

$(function () {
    get_data(true);
})


function curlApi(request) {
    console.log(request);
    const method = request.method;
    const url = request.url;
    const headers = request.headers;
    var body = ""
    try {
        body = request.postData.text;
    } catch {
    }
    var curlCommand = `curl '${url}'`;

    if (headers) {
        headers.forEach((value, key) => {
            curlCommand += ` -H '${value.name.replace(/^:/, "")}: ${value.value}'`;
        });
    }

    if (body) {
        curlCommand += ` --data-raw '${body}'`;
    }
    return curlCommand
}

// curlApi({
//     method: method,
//     url: url,
//     headers: cursor.value.request.headers,
//     body: bodydata,
// })
function copyApi(e) {
    console.log(e)
    // 获取toast的引用
    Toast('Curl', '复制成功')
    navigator.clipboard.writeText(e).then(function () {
        console.log('Text copied to clipboard');
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

function del_one_data(pid) {
    const request = indexedDB.open("myDatabase1", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore1")) {
            db.createObjectStore("myDataStore1", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore1", "readwrite");
        const store = transaction.objectStore("myDataStore1");
        const request = store.delete(Number(pid));
        request.onsuccess = function (e) {
            console.log('Item deleted successfully');
        };

        request.onerror = function (e) {
            console.error('Delete error:', e);
        };
        transaction.oncomplete = function () {
            // 可选：关闭数据库连接
            db.close();
        };
        transaction.onerror = function (e) {
            console.error('Transaction error:', e);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}


function Toast(title = "", content = "") {
    var myToast = $('#myToast');
    document.getElementById('toastTitle').innerText = title
    document.getElementById('toastBody').innerText = content
    $('#myToast').toast({delay: 1000}); // 设置3秒后自动消失
    myToast.toast('show');
}


document.addEventListener('DOMContentLoaded', function () {

});

function export_table_data() {
 // 假设表格有一个ID，如<table id="myTable">
 var table = document.querySelector('#tableData');
 var rows = table.querySelectorAll('tr');

 var tableData = [];
 let num=0;
 rows.forEach(function(row) {
  if(num>0){
     var columns = row.querySelectorAll('td');
     var rowData = [];

     columns.forEach(function(column) {
         rowData.push(column.textContent.trim());
     });

     tableData.push(rowData);
     }
     num=num+1;
 });

 console.log(tableData);
}
//替换表格式件
function reps_table_data(from,to) {
   //替换刷新数据
    dataflag = true;
    dataType = false;
    reps={}
    reps.key=from
    reps.value=to

    get_data(dataflag, dataType,reps);
}

function convertTransactionsPostman(name,transactions) {
      var  data={}
      var  info={}
      info.name=name
      info._postman_id=this.uuid()
      info.schema='https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      info._exporter_id=this.formattedDate()
      data.info=info
      var item=[]
      var num =1;

      let keys = Object.keys(transactions);
      keys.forEach(key => {
            //求获取过滤类型条件
            if ((dataType != false  && dataType.includes(transactions[key]._resourceType))||dataType ==false) {
               var num=1;
               var array={}
               var rst={}
               array.name=name+"_未定义接口_序号"+num
               num=num+1;
               rst.method=transactions[key].request.method
               rst.header=transactions[key].request.headers
               Object.keys(rst.header).forEach(k => {
                    rst.header[k].type='text'
               });

               rst.body={}

               if( transactions[key].request.hasOwnProperty("postData") ){

                  if(transactions[key].request.postData.mimeType.includes('multipart/form-data')){
                    rst.body.mode="formdata"
                    rst.body.formdata=transactions[key].request.postData.params
                  }else{
                    rst.body.mode="raw"
                    rst.body.raw=transactions[key].request.postData.text
                  }
               }
               rst.response={}
               rst.response.headers=transactions[key].response.headers
               rst.response.status=transactions[key].response.status
               rst.response.time=transactions[key].response.time
               rst.response.content=transactions[key].content

                const str = transactions[key].request.url
 		        var index = str.indexOf(":")
 		        var resolve = str.substring(0, index);
 		        console.log(resolve)
 		        if(resolve==""){ resolve="http"}

 		        // url转变量
 		        var query =transactions[key].request.queryString
 		        let urlStr=str //.replace(this.getDomain(str),"$$${domain}")
                rst.url={"raw":urlStr.substring(0, 255),"protocol":resolve,"query":query}
                array.request=rst
                array.response=[]
                item.push(array)
                num=num+1;

            }
            });
      data.item=item;
      return data;
    }

function   convertTransactionsEXCEL(transactions) {
        var deviceList = [
                ["*用例名称","用例描述","*请求类型","请求头参数","*请求地址","环境分组","IP变量名","请求体类型","请求体","检查点匹配方式","检查点期望值"]
                       ]
        let keys = Object.keys(transactions);
        keys.forEach(key => {
        if (!transactions[key].hasOwnProperty("url")) {
             let name = key.split(" [")[0];
             let request = [];
             let traffic = Object.keys(transactions[key]);
             let num=1;
             traffic.forEach(index => {
             let headers=""
             let hds=transactions[key][index]['headers']
             hds.forEach(key => {
                  headers=headers+key['name']+"="+key['value']+"&"
                      });
        let array=[]
        array.push(name)
        array.push(name+num)
        array.push(transactions[key][index]['method'])
        array.push(headers)
        array.push(transactions[key][index]['url'])
        array.push("alpha")
        array.push("")
        array.push("json")
        array.push(JSON.stringify(transactions[key][index]['body']))
        array.push("精确匹配")
        array.push("success")
        deviceList.push(array)
        num=num+1;
                    })
            } else {
                 alert("数据异常，未抓取响应的请求数据")
            }
        });

        var sheet = XLSX.utils.aoa_to_sheet(deviceList);
        return this.sheet2blob(sheet,name);
    }

function downloadJMX(name, domains, transactions) {
        let data = this.convertTransactions(transactions);
        let jmx = new JMXGenerator(data, name, domains);
        this.download(name + ".jmx", jmx.toXML());
    }

function download(name, str) {
        let blob = new Blob([str], {type: "application/octet-stream"});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

function downloadJSON(name, transactions) {
        this.download(name + ".json", JSON.stringify(transactions));
    }

function downloadPostman(name, transactions) {
        let blob=  this.convertTransactionsPostman(name,transactions);


        this.download(name+'_'+this.formattedDate() + ".json", JSON.stringify(blob, null, 4));
    }
function export_data() {
  var  list=[]
    return new Promise((resolve, reject) => {
     const request = indexedDB.open("myDatabase", db_version);
     request.onupgradeneeded = function (event) {
         const db = event.target.result;
         if (!db.objectStoreNames.contains("myDataStore")) {
             db.createObjectStore("myDataStore", {
                 keyPath: "id",
                 autoIncrement: true,
             });
         }
     };

     request.onsuccess = function (event) {
         const db = event.target.result;
         const transaction = db.transaction("myDataStore", "readwrite");
         const objectStore = transaction.objectStore("myDataStore");
          // 获取所有记录
          var getAll = objectStore.getAll();
          getAll.onerror = (event) => {
              console.log("查询失败");

              reject(event.target.errorCode);
          };
          getAll.onsuccess= (event) => {
              //list就是查询到的所有数据
              list = getAll.result
              console.log(list);
              console.log("查询成功");
              resolve(event.target.result);


          };

     };

     request.onerror = function (event) {
         console.error("打开IndexedDB时发生错误:", event.target.errorCode);
     };

  });
    return list;
}



    // 将一个sheet转成最终的excel文件的blob对象
function sheet2blob(sheet, sheetName) {

    sheetName = sheetName || 'sheet1';
    var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // 字符串转ArrayBuffer
    function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
    }
    return blob;
    }
function uuid() {
	   var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
		    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    return uuid;
    }
function getDomain(url) {
        var domain=""
        try {
            domain = new URL(url).hostname;
            //const domain = url.split('/')[2];
          } catch (e) {
             console.info("url格式错误: " + domain)
          }
	    return domain
    }
function getUrlParams(url) {
        // 通过 ? 分割获取后面的参数字符串
        let urlStr = url.split('?')[1]
        // 创建空对象存储参数

	    let params = [];
        // 再通过 & 将每一个参数单独分割出来
	    let paramsArr = urlStr.split('&')
	    for(let i = 0,len = paramsArr.length;i < len;i++){
            // 再通过 = 将每一个参数分割为 key:value 的形式
		    let arr = paramsArr[i].split('=')
		    console.log(arr)
		    let obj  ={"key":arr[0],"value":arr[1]}
			params.push(obj)

	    }
        console.log(params)
	    return params
    }
function getUrlParamsNew(url) {
        const searchParams = new URLSearchParams(new URL(url).search);
        const params = {};

        searchParams.forEach((value, name) => {
        params[name] = value;
            });

        return params;
    }
function getUrlPath(url) {
        var path=""
        try {
            var path = new URL(url).pathname;
          } catch (e) {
             console.info("path格式错误: " + path)
          }
	    return path
    }
function formattedDate() {
        let currentTime = new Date();

        // 获取年份
        let year = currentTime.getFullYear();

        // 获取月份（注意月份是从0开始计数的，所以需要加1）
        let month = currentTime.getMonth() + 1;

        // 获取日期
        let day = currentTime.getDate();

        // 获取小时
        let hours = currentTime.getHours();

        // 获取分钟
        let minutes = currentTime.getMinutes();

        // 获取秒数
        let seconds = currentTime.getSeconds();

        // 格式化时间为 YYYYMMDDHHMMSS
        let formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
	    return formattedDate;
    }



function getDict(){
      let obj ={}
      obj["/contract/api/"]="接口自动命名列表"





      return obj
    }
// 监听整个document的click事件
document.addEventListener('click', function (event) {
    // 检查点击的是否是复选框
    const isChecked = Array.from(document.querySelectorAll('.select-checkbox')).some(el => el.checked);
    // 根据是否有复选框被选中，显示或隐藏删除按钮
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.style.display = isChecked ? 'inline-block' : 'none';
    // 检查点击的是否是删除按钮
    if (event.target.id === 'deleteButton') {
        // 找到所有选中的复选框所在的行并删除它们
        document.querySelectorAll('.select-checkbox:checked').forEach(checkbox => {
            var pid = checkbox.getAttribute('pid')
            del_one_data(pid)
            var numElement = document.getElementById("num");
            lc = lc - 1
            numElement.innerHTML = lc;
            checkbox.closest('tr').remove();
        });
        // 删除后隐藏删除按钮，因为至少有一个复选框被选中的情况不再成立
        deleteButton.style.display = 'none';
    }
});