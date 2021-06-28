package server

import (
	"fmt"
	"log"

	"../capture"
	"../diskmanagement"
)

var streamingClients map[string]bool = make(map[string]bool)

func HandleClientMessage(h *Hub, clientmessage *Message) {
	fmt.Println("HandleClient")

	for client := range h.clients {
		if client.id == clientmessage.To {
			log.Println(clientmessage)

			switch mtype := clientmessage.Type; mtype {
			case START_STREAM:
				if !streamingClients[client.id] {
					streamingClients[client.id] = true
					go func() {
						for streamingClients[client.id] {
							log.Println("sending stream to " + clientmessage.To)
							sendStream, encStream := capture.DifferentialCapture()
							if sendStream {
								err := client.conn.WriteJSON(&Message{To: clientmessage.To, Message: encStream, Type: START_STREAM, From: "SERVER"})
								if err != nil {
									log.Println(err.Error())
									break
								}
							}
						}
					}()
				}
			case STOP_STREAM:
				if streamingClients[client.id] {
					streamingClients[client.id] = false
					delete(streamingClients, client.id)
					err := client.conn.WriteJSON(&Message{To: clientmessage.To, Message: "Stop Streaming", Type: STOP_STREAM, From: "SERVER"})
					if err != nil {
						log.Println(err.Error())
						break
					}
				}
			case LIST_DRIVE:
				log.Println("List Drives")
				driveList := diskmanagement.GetDriveListJSON()
				err := client.conn.WriteJSON(&Message{To: clientmessage.To, Message: driveList, Type: LIST_DRIVE, From: "SERVER"})
				if err != nil {
					log.Println(err.Error())
					break
				}
			case FETCH_PATH:
				log.Println("Fetch Path")
				path := clientmessage.Message
				directoryInfos := diskmanagement.GetDirectoryInfoJSON(path)
				err := client.conn.WriteJSON(&Message{To: clientmessage.To, Message: directoryInfos, Type: FETCH_PATH, From: "SERVER"})
				if err != nil {
					log.Println(err.Error())
					break
				}
			}
		}
	}
}
