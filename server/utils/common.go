package utils

type Message struct {
	To      string `json:"to"`
	Message string `json:"message"`
	Type    string `json:"type"`
	From    string `json:"from"`
}

/*type SendMessage struct {
	To      string `json:"to"`
	Message string `json:"message"`
}

type ReceiveMessage struct {
	From    string `json:"from"`
	Message string `json:"message"`
}*/
