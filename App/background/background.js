let ws;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request)
        //サーバー接続/切断要求
        if (request.value.type === 10) {

            //多重にコネクション張っちゃうのを防ぐ目的でwsの中身があった場合にCloseする
            if (ws !== undefined && (ws.OPENED || ws.OPEN)) {
                ws.close()
                //サーバー切断完了通知
                sendResponse({
                    value: {
                        "type": 26,
                    }
                });
                return true
            } else {
                let result = openSocket()
                console.log(result)
                if (result === true) {
                    //サーバー接続完了通知
                    sendResponse({
                            value: {
                                "type": 25,
                            }
                        }
                    );
                    return true
                } else {
                    //サーバー切断完了通知
                    sendResponse({
                        value: {
                            "type": 26,
                        }
                    });
                    return true
                }
            }
            //メッセージ
        } else if (request.value.type === 50) {

            let sendObject = request.value
            //Object.assign(messageObjectBase, request.value)
            let jsonText = JSON.stringify(sendObject)
            sendMessage(jsonText)
            return true
        }
    });


function openSocket() {
    //多重にコネクション張っちゃうのを防ぐ目的でwsの中身があった場合にCloseする
    if (ws !== undefined && (ws.OPENED || ws.OPEN)) {
        ws.close()
        return false
    }

    ws = new WebSocket("ws://127.0.0.1:9999/ws");

    ws.onopen = function () {
        changeIcon_On()
        console.log("Darkness Meet : open socket")
    };
    ws.onclose = function () {
        ws = undefined;
        changeIcon_Off()
        console.log("Darkness Meet : socket close")
    };

    return true
}


function sendMessage(message) {
    if (ws === undefined) {
        return
    }
    ws.send(message)
}


function changeIcon_Off() {
    chrome.browserAction.setIcon({path: "../src/chatget_off.png"});
}

function changeIcon_On() {
    chrome.browserAction.setIcon({path: "../src/chatget_on.png"});
}