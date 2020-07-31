If not exist ReleaseForOSX mkdir ReleaseForOSX
set GOOS=darwin
set GOARCH=amd64
go build -o ReleaseForOSX/DarknessGMCGetServer


If not exist ReleaseForWin mkdir ReleaseForWin
set GOOS=windows
set GOARCH=amd64
go build -o ReleaseForWin/DarknessGMCGetServer.exe
