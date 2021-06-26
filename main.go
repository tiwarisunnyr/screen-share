package main

import (
	disk "./diskmanagement"
	server "./server"
)

func main() {
	server.InitServer()
	disk.GetDrives()
}
