package diskmanagement

import (
	"encoding/json"
	"math"

	"github.com/shirou/gopsutil/v3/disk"
)

type DriveDetails struct {
	MountPoint   string  `json:"mountpoint"`
	DisplayLabel string  `json:"display"`
	TotalBytes   uint64  `json:"totalsize"`
	UsedBytes    uint64  `json:"usedbytes"`
	FreeBytes    uint64  `json:"freebytes"`
	PercentUsage float64 `json:"percentusage"`
}

func GetDrives() []DriveDetails {
	v, _ := disk.Partitions(true)
	var driveList []DriveDetails

	for i := 0; i < len(v); i++ {
		usage, _ := disk.Usage(v[i].Mountpoint)
		details := &DriveDetails{
			MountPoint:   v[i].Mountpoint,
			DisplayLabel: "Local Disk (" + v[i].Mountpoint + ")",
			TotalBytes:   usage.Total,
			UsedBytes:    usage.Used,
			FreeBytes:    usage.Free,
			PercentUsage: math.Round(usage.UsedPercent),
		}
		driveList = append(driveList, *details)
	}
	return driveList
}

func GetDriveListJSON() string {
	jsonBytes, _ := json.Marshal(GetDrives())
	return string(jsonBytes)
}
