let connectChatButton = document.getElementById('connectChat');
let connectServerButton = document.getElementById('connectServer');


// 現在アクティブなタブにデータを送信
function sendConnectChatMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            "ChatSearchRequest");
    });
}


function sendConnectServerMessage() {
    chrome.runtime.sendMessage({
            //サーバー接続/切断 要求通知
            value: {
                "type": 10,
            }
        },
        //レスポンスによってボタンの内容変更
        function (response) {
            if (response === undefined) {
                return
            }
            if (response.value.type === 25) {
                //サーバ接続後の処理
                connectServerButton.innerText = "サーバーから切断"
            } else if (response.value.type === 26) {
                //サーバー切断後の処理
                connectServerButton.innerText = "サーバーに接続"
            }
        });
}


connectChatButton.addEventListener('click', sendConnectChatMessage);
connectServerButton.addEventListener('click', sendConnectServerMessage);