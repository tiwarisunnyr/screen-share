package server

import (
	"flag"
	"log"
	"net/http"
)

const (
	INIT_CONNECTION = "initconnection"
	START_STREAM    = "startstream"
	STOP_STREAM     = "stopstream"
	CONTINUE_STREAM = "continuestream"
	READY_STREAM    = "readystream"
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
