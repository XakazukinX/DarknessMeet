package main

import (
	"DarknessMeet/Model"
	"flag"
	"log"
	"net/http"
)

var logMode = flag.String("logMode", "text", "set server logging mode")

func main() {
	flag.Parse()

	f := Model.NewFlagDefine(*logMode)

	meetChatServer := Model.NewMeetChatServer(f)
	meetChatServer.Init()

	// ファイルサーバーを立ち上げる
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", meetChatServer.HandleConnections)

	log.Printf("Init Darkness GMC Get server !")

	if err := http.ListenAndServe(":9999", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	log.Printf("StopServer")
}
