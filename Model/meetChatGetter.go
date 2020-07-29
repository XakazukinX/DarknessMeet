package Model

type meetChatGetter struct {
	fetchTime uint
}

func NewMeetChatGetter(fetchTime uint) *meetChatGetter {
	return &meetChatGetter{
		fetchTime: fetchTime,
	}
}

/*func (m meetChatGetter) Init(){


}*/

func getGoogleMeetChat() {
}
