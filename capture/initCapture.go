package capture

import (
	"bytes"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"image/png"

	"github.com/kbinani/screenshot"
)

var prevScreenHash []byte

// Capture : start capturing screen
func Capture() string {
	bounds := screenshot.GetDisplayBounds(0)
	img, err := screenshot.CaptureRect(bounds)
	if err != nil {
		panic(err)
	}

	var buff bytes.Buffer
	png.Encode(&buff, img)

	encodedString := base64.StdEncoding.EncodeToString(buff.Bytes())

	return encodedString
}

// DifferentialCapture : capture changed screen
func DifferentialCapture() (bool, string) {
	bounds := screenshot.GetDisplayBounds(0)
	img, err := screenshot.CaptureRect(bounds)
	if err != nil {
		fmt.Println(err.Error)
		panic(err)
	}
	var sendImage = true
	var buff bytes.Buffer
	png.Encode(&buff, img)
	h := sha1.New()
	h.Write(buff.Bytes())

	curHash := h.Sum(nil)
	if prevScreenHash == nil {
		prevScreenHash = curHash
	} else {
		if bytes.Equal(curHash, prevScreenHash) {
			sendImage = false
		} else {
			prevScreenHash = curHash
			sendImage = true
		}
	}

	encodedString := base64.StdEncoding.EncodeToString(buff.Bytes())
	return sendImage, encodedString
}
