package server

import (
	"flag"
	"log"
	"net/http"
)

const (
	INIT_CONNECTION = "1"
	ACK_RESPONSE    = "2"

	START_STREAM    = "11"
	STOP_STREAM     = "12"
	CONTINUE_STREAM = "13"
	READY_STREAM    = "14"

	LIST_DRIVE = "31"
	FETCH_PATH = "32"
)

var addr = flag.String("addr", ":5220", "http service address")

// InitServer : Start server
func InitServer() {
	hub := newHub()
	go hub.run()
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	log.Println("Server running on " + *addr)
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
