package main

import (
	"DarknessMeet/Model"
	"log"
	"net/http"
)

func main() {
	log.Printf("Hello Go wasm")
	meetChatServer := Model.NewMeetChatServer()
	meetChatServer.Init()

	// ファイルサーバーを立ち上げる
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", meetChatServer.HandleConnections)

	log.Printf("Init websocket server !")

	if err := http.ListenAndServe(":9999", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	log.Printf("StopServer")
}
