package Model

import (
	"DarknessMeet/Model/LoggingMode"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strings"
	"unsafe"
)

type meetChatServer struct {
	Clients       map[*websocket.Conn]bool
	BroadcastChan chan []byte
	Upgrader      websocket.Upgrader
	FlagDefine    *flagDefine
}

func NewMeetChatServer(f *flagDefine) *meetChatServer {
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
		FlagDefine: f,
	}
}

func (m meetChatServer) Init() {
	go m.handleMessages()
}

func (m meetChatServer) HandleConnections(w http.ResponseWriter, r *http.Request) {
	log.Printf("Connected")
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

func (m *meetChatServer) handleMessages() {
	for {
		// ブロードキャストチャンネルにデータが流れてくるので、それをそのまま全Clientに垂れ流し
		data := <-m.BroadcastChan
		m.loggingPacket("StartBroadcast", data)
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

func (m meetChatServer) loggingPacket(logMsg string, data []byte) {

	if strings.EqualFold(LoggingMode.Text, m.FlagDefine.loggingMode) {
		dataText := *(*string)(unsafe.Pointer(&data))
		log.Printf("%v : %v", logMsg, dataText)
	} else if strings.EqualFold(LoggingMode.Binary, m.FlagDefine.loggingMode) {
		log.Printf("%v : %v", logMsg, data)
	} else {
		//Noneまたはその他の文字列が入っていた場合は出力しない
	}
}
