package server

import (
	"log"

	"../capture"
	"./utils"
	"golang.org/x/exp/errors/fmt"
)

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

	clientmessage chan utils.Message
}

var streamingClients map[string]bool = make(map[string]bool)

func newHub() *Hub {
	return &Hub{
		broadcast:     make(chan []byte),
		register:      make(chan *Client),
		unregister:    make(chan *Client),
		clients:       make(map[*Client]bool),
		clientmessage: make(chan utils.Message),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			log.Println(len(h.clients))
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		case clientmessage := <-h.clientmessage:
			fmt.Println("clientmessage")
			for client := range h.clients {
				if client.id == clientmessage.To {
					log.Println(clientmessage)
					if clientmessage.Type == START_STREAM {
						if streamingClients[client.id] == false {
							log.Println(streamingClients)
							streamingClients[client.id] = true
							log.Println("Start Streaming...")
							log.Println(streamingClients)
							go func() {
								for streamingClients[client.id] == true {
									log.Println("sending stream to " + clientmessage.To)
									sendStream, encStream := capture.DifferentialCapture()
									if sendStream == true {
										err := client.conn.WriteJSON(&utils.Message{To: clientmessage.To, Message: encStream, Type: START_STREAM, From: "SERVER"})
										if err != nil {
											log.Println(err.Error())
											break
										}
									}
								}
							}()
						}
					} else if clientmessage.Type == STOP_STREAM {
						if streamingClients[client.id] == true {
							log.Println("Stop Streaming...")
							log.Println(streamingClients)
							streamingClients[client.id] = false
							delete(streamingClients, client.id)
							err := client.conn.WriteJSON(&utils.Message{To: clientmessage.To, Message: "Stop Streaming", Type: STOP_STREAM, From: "SERVER"})
							if err != nil {
								log.Println(err.Error())
								break
							}
						}
					}
				}
			}
		}
	}
}
