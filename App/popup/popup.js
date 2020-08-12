let connectChatButton = document.getElementById('connectChat');
let connectServerButton = document.getElementById('connectServer');

//backgroundからサーバーの接続状態を確認しにいく
chrome.runtime.sendMessage(
    "GetServerStatusRequest",
    function (response) {
        if (response === undefined) {
            connectServerButton.innerText = "サーバーに接続"
        } else if (response === false) {
            connectServerButton.innerText = "サーバーに接続"
        } else if (response === true) {
            connectServerButton.innerText = "サーバーから切断"
        }
    });

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id,
        "GetChatStatusRequest",
        function (response) {
            if (response === undefined) {
                connectChatButton.innerText = "チャットに接続"
            } else if (response === false) {
                connectChatButton.innerText = "チャットに接続"
            } else if (response === true) {
                connectChatButton.innerText = "チャットから切断"
            }
        });
});

// 現在アクティブなタブにデータを送信
function sendConnectChatMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
                value: {
                    "type": 5,
                }
            },
            function (response) {
                if (response === undefined) {
                    return
                } else if (response.value.type === 6) {
                    connectChatButton.innerText = "チャットに接続"
                } else if (response.value.type === 7) {
                    connectChatButton.innerText = "チャットから切断"
                }
            });
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
                connectServerButton.innerText = "サーバーに接続"
                return
            }
            if (response.value.type === 25) {
                //サーバ接続後の処理
                connectServerButton.innerText = "サーバーから切断"
            } else if (response.value.type === 26) {
                //サーバー切断後の処理
                connectServerButton.innerText = "サーバーに接続"
            } else {
                connectServerButton.innerText = "サーバーに接続"
            }

        });
}


connectChatButton.addEventListener('click', sendConnectChatMessage);
connectServerButton.addEventListener('click', sendConnectServerMessage);