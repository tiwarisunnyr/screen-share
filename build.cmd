@echo off
rmdir bin /Q/S
go build -o bin\server.exe
xcopy static bin\static\ /E