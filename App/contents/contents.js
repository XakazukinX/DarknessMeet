//監視対象のClass
//20200729現在'z38b6 CnDs7d hPqowe'がGoogleMeetのチャット
//const rootNode = 'z38b6 CnDs7d hPqowe';
let monitored;//= document.getElementsByClassName('z38b6 CnDs7d hPqowe'); // 監視対象のノードを取得

//監視対象ノードに変更があったときの処理
const observer = new MutationObserver(function (mutations) { // オブザーバインスタンスを作成
    mutations.forEach(function (mutation) {
        // 変更された時の処理
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let node = mutation.addedNodes[i];
            if (!(node instanceof HTMLElement)) continue;

            //時間の変更・チャットユーザーのアップデートが存在していないとき
            if (node.matches('[class="oIy2qc"][jsname*="dTKtvb"]')) {
                let chat = node.innerText
                // 送信側 contents -> background
                chrome.runtime.sendMessage(
                    {
                        value: {
                            "type": 50,
                            contents: chat
                        }
                    }
                );
            }
            //時間の変更・チャットユーザーのアップデートが存在しているとき
            else if (node.matches('[class="GDhqjd"][jsname*="Ypafjf"]')) {
                for (let j = 0; j < node.childNodes.length; j++) {
                    let child = node.childNodes[j]
                    if (!(child instanceof HTMLElement)) continue;
                    //さらに掘る
                    for (let k = 0; k < child.childNodes.length; k++) {
                        let Grandchild = child.childNodes[k]
                        if (Grandchild.matches('[class="oIy2qc"][jsname*="dTKtvb"]')) {
                            let chat = Grandchild.innerText
                            chrome.runtime.sendMessage(
                                {
                                    value: {
                                        "type": 50,
                                        contents: chat
                                    }
                                }
                            );
                        }
                    }
                }
            }
        }
    });
});

//監視のオプション
const option = {
    childList: true,
    subtree: true
};

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.value !== undefined) {
        if (request.value.type === 5) {
            monitored = document.getElementsByClassName('z38b6 CnDs7d hPqowe');
            if (monitored.length === 0) {
                console.log("Darkness Meet : チャットが見つかりませんでした。GoogleMeetのチャットを開いた状態で再度接続ボタンを押してください。")
                sendResponse({
                        value: {
                            "type": 6,
                        }
                    }
                );
                return true
            } else {
                //見つかったら監視をいったん停止する。
                observer.disconnect();
                StartMonitor();
                sendResponse({
                        value: {
                            "type": 7,
                        }
                    }
                );
                return true
            }
        }
    } else if (request.toString() === "GetChatStatusRequest") {
        if (monitored !== undefined) {
            if (monitored.length !== undefined) {
                if (monitored.length === 0) {
                    sendResponse(false)
                } else {
                    sendResponse(true)
                }
            }
        } else {
            sendResponse(false)
        }
    }
});

function StartMonitor() {
    //監視対象ノードが1件でもあれば監視を開始する。
    if (monitored.length !== 0) {
        observer.observe(monitored[0], option);
    }
}

