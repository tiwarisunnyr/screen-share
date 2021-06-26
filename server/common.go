package server

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	clientmessage chan *Message
}

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
