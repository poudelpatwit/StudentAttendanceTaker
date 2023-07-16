
async function submitAttendance() {

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
                                videoElement.pause();  // Pause the video feed
                                if (stream) {
                                    stream.getTracks().forEach(track => track.stop()); // Stop the camera
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
        let response = await fetch('https://enormous-oil-speedwell.glitch.me/submit-attendance', {
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
}


//fetch all the courses for the user
async function fetchCourses() {
    try {
        const response = await fetch(`${url}/user-courses`, {
            credentials: 'include'
        });
        const data = await response.json();
        console.log("Courses for a student: ", data);

        if (!response.ok) {
            console.error('Error:', response.statusText);
            // Handle error...
        }

        const courseDropdown = document.querySelector('#courseDropdown');
        courseDropdown.innerHTML = ''; // clear previous options

        data.forEach((course) => {
            const courseOption = document.createElement('option');
            courseOption.value = course.id;
            courseOption.innerText = course.name;
            courseDropdown.appendChild(courseOption);

            // If there's only one course, fetch its lectures immediately
            if (data.length === 1) {
                fetchLecturesForToday(course.id);
            }
        });


    } catch (error) {
        console.error('Error:', error);
    }
}

fetchCourses(); // Call the function here after it is defined.

//get all the lectures for today
async function fetchLecturesForToday(courseId) {
    try {
        const response = await fetch(`${url}/today-lectures-using-user-id`, {
            method: 'POST',
            credentials: 'include'
        });
        const lecturesData = await response.json();
        console.log("Lectures for today: ", lecturesData);

        if (!response.ok) {
            throw new Error('Error:', response.statusText);
            // Handle error...
        }

        const lecturesTodayDiv = document.getElementById('lecturesToday');
        lecturesTodayDiv.innerHTML = '';

        //if lecture data has no entries just show the text saying no lecture today
        if (lecturesData.length == 0) {
            lecturesTodayDiv.innerHTML = "<h1> No Lecture found today. <h1>"
        }

        lecturesData.forEach((lecture) => {
            const lectureDiv = document.createElement('div');
            lectureDiv.classList.add("card");
            lectureDiv.innerHTML = `
                <h2>${lecture.name}</h2>
                <p> Start Time: ${lecture.lecture_start_time}</p>
                <p> End Time: ${lecture.lecture_end_Time}</p>
                <button id="submit-attendance-${lecture.id}" class="submit-attendance">Submit Attendance</button>
            `;

            lecturesTodayDiv.appendChild(lectureDiv);

            document.getElementById(`submit-attendance-${lecture.id}`).addEventListener('click', submitAttendance);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('courseDropdown').addEventListener('change', function (event) {
    const courseId = event.target.value;

    // Fetch lectures for today when a course is selected
    fetchLecturesForToday(courseId);
});
