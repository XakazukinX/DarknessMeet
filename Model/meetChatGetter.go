package Model

/*
import (
	"log"
	"syscall/js"
)

type meetChatGetter struct {
	meetChatServer *meetChatServer
}

func NewMeetChatGetter(server *meetChatServer) *meetChatGetter {
	return &meetChatGetter{
		meetChatServer: server,
	}
}

func (m meetChatGetter) SetGoogleMeetChat(value js.Value, args []js.Value) interface{} {
	//argsに詰まってなかったら無視
	if len(args) == 0 {
		return nil
	}
	if js.ValueOf(args[0]).IsUndefined() {
		return nil
	}

	jsonText := js.ValueOf(args[0]).String()
	jsonData := []byte (jsonText)
	m.meetChatServer.BroadcastChan <- jsonData
	log.Printf("In Golang Get From Chrome %v", jsonText)
	return nil
}
*/
