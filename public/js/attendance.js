document.getElementById('submit-attendance').addEventListener('click', async (event) => {
    // prevent form from submitting normally
    event.preventDefault();

    // function to get user's location
    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    //function to scan the qr code data
    const getQRCode = () => {
        return new Promise((resolve, reject) => {
            let videoElement = document.getElementById('qr-video');
            let stream;

            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then((mediaStream) => {
                    stream = mediaStream;
                    videoElement.srcObject = stream;
                    videoElement.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                    videoElement.play();

                    videoElement.onloadedmetadata = () => {
                        let canvasElement = document.createElement('canvas');
                        canvasElement.width = videoElement.videoWidth;
                        canvasElement.height = videoElement.videoHeight;
                        let canvas = canvasElement.getContext('2d');

                        const scanInterval = setInterval(() => {
                            canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                            let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                            let code = jsQR(imageData.data, imageData.width, imageData.height);

                            if (code) {
                                clearInterval(scanInterval);
                                videoElement.pause();
                                if (stream) {
                                    stream.getTracks().forEach(track => track.stop());
                                }
                                resolve(code.data);
                            }
                        }, 500);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }





    try {
        // get the location data
        const position = await getLocation();

        // create data for the QR code, which includes the location
        let locationData = {
            // include other data you want in the QR code
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
        };

        const qrCodeData = await getQRCode();


        console.log("Location Data: ", locationData)
        console.log("QR Code Data: ", qrCodeData)


        const attendanceData = {
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            qrCodeData: qrCodeData
        }


        const jsonAttendanceData = JSON.stringify(attendanceData);

        // send your data to the server for verification
        let response = await fetch('https://enormous-oil-speedwell.glitch.me/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonAttendanceData
        });

        // check response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            // if everything is ok, you can parse and use the response data
            let result = await response.json();
            console.log(result);
        }
    } catch (error) {
        console.log('There was a problem with the fetch operation: ' + error.message);
    }
});




