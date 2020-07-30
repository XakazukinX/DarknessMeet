package Model

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type meetChatServer struct {
	Clients       map[*websocket.Conn]bool
	BroadcastChan chan []byte
	Upgrader      websocket.Upgrader
}

func NewMeetChatServer() *meetChatServer {
	return &meetChatServer{
		Clients:       make(map[*websocket.Conn]bool),
		BroadcastChan: make(chan []byte),
		Upgrader: websocket.Upgrader{
			HandshakeTimeout: 20,
			ReadBufferSize:   1024,
			WriteBufferSize:  1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

func (m meetChatServer) Init() {
	go m.handleMessages()
}

func (m meetChatServer) HandleConnections(w http.ResponseWriter, r *http.Request) {
	log.Printf("Connected")
	// 送られてきたGETリクエストをwebsocketにアップグレード
	ws, err := m.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	// 関数が終わった際に必ずwebsocketnのコネクションを閉じる
	defer func() {
		delete(m.Clients, ws)
		err := ws.Close()
		if err != nil {
			panic("Server Error")
		}
	}()

	// クライアントを新しく登録
	m.Clients[ws] = true

	for {
		//コネクションの切断をReadMessageaで監視しておく
		_, data, err := ws.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(m.Clients, ws)
			break
		}
		m.BroadcastChan <- data

	}
}

func (m meetChatServer) handleMessages() {
	for {
		// ブロードキャストチャンネルにデータが流れてくるので、それをそのまま全Clientに垂れ流し
		data := <-m.BroadcastChan
		log.Printf("Start Broadcast %v", data)
		// 現在接続しているクライアント全てにメッセージを送信する
		for client := range m.Clients {
			err := client.WriteMessage(websocket.BinaryMessage, data)
			if err != nil {
				log.Printf("error: %v", err)
				err = client.Close()
				if err != nil {
					panic("Server Error")
				}
				delete(m.Clients, client)
			}
		}
	}
}
