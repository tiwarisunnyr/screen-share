package diskmanagement

import (
	"encoding/json"
	"log"
	"math"
	"os"
	"runtime"
	"time"

	"github.com/shirou/gopsutil/v3/disk"
)

type DriveInfo struct {
	MountPoint   string  `json:"mountpoint"`
	DisplayLabel string  `json:"display"`
	TotalBytes   uint64  `json:"totalsize"`
	UsedBytes    uint64  `json:"usedbytes"`
	FreeBytes    uint64  `json:"freebytes"`
	PercentUsage float64 `json:"percentusage"`
}

type DirectoryInfo struct {
	FileName     string    `json:"filename"`
	FileSize     uint64    `json:"size"`
	IsDir        bool      `json:"isdir"`
	CreatedDate  time.Time `json:"created"`
	ModifiedDate time.Time `json:"modified"`
}

func GetDrives() []DriveInfo {
	var driveList []DriveInfo
	isWindowsSystem := false
	if runtime.GOOS == "windows" {
		isWindowsSystem = true
	}
	v, _ := disk.Partitions(true)
	for i := 0; i < len(v); i++ {
		usage, _ := disk.Usage(v[i].Mountpoint)
		displayLabel := v[i].Mountpoint
		if isWindowsSystem {
			displayLabel = "Local Disk (" + v[i].Mountpoint + ")"
		}
		if (!isWindowsSystem && v[i].Mountpoint == "/") || isWindowsSystem {
			if usage.Total > 0 {
				details := &DriveInfo{
					MountPoint:   v[i].Mountpoint,
					DisplayLabel: displayLabel,
					TotalBytes:   usage.Total,
					UsedBytes:    usage.Used,
					FreeBytes:    usage.Free,
					PercentUsage: math.Round(usage.UsedPercent),
				}
				driveList = append(driveList, *details)
			}
		}
	}
	return driveList
}

func GetDriveListJSON() string {
	jsonBytes, _ := json.Marshal(GetDrives())
	return string(jsonBytes)
}

func FetchDrives(root string) []DirectoryInfo {
	file, err := os.Open(root)
	if err != nil {
		log.Fatalf("failed opening directory: %s", err)
	}
	defer file.Close()

	fileList, _ := file.Readdir(0)
	var directoryInfos []DirectoryInfo
	for _, files := range fileList {
		directoryInfo := &DirectoryInfo{
			FileName:     files.Name(),
			FileSize:     uint64(files.Size()),
			IsDir:        files.IsDir(),
			CreatedDate:  files.ModTime(),
			ModifiedDate: files.ModTime(),
		}
		directoryInfos = append(directoryInfos, *directoryInfo)
	}
	return directoryInfos
}

func GetDirectoryInfoJSON(root string) string {
	jsonBytes, _ := json.Marshal(FetchDrives(root))
	return string(jsonBytes)
}
