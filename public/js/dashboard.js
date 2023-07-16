document.getElementById('logout').addEventListener('click', function () {
    fetch(`${url}/logout`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Logged out successfully') {
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
});


//set the username
const username = localStorage.getItem('username');
document.querySelector('.user-welcome').textContent = `Welcome ${username}!`;


document.querySelector('.close-button').addEventListener('click', () => {
    // Hide the popup
    document.querySelector('.popup-overlay').classList.remove('active');

    // Clear the QR code and location
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('location').textContent = '';
});


// Function to generate a card for a single lecture
function createLectureCard(lecture) {
    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.id = 'class-name';
    h2.textContent = lecture.name;

    const p1 = document.createElement('p');
    p1.textContent = `Date: ${lecture.lecture_date}`;// You may need to adjust this if the format of lecture.time is not '2pm-3pm'


    const p2 = document.createElement('p');
    p2.textContent = `Start Time: ${lecture.lecture_start_time}`;

    const p3 = document.createElement('p');
    p3.textContent = `End Time: ${lecture.lecture_end_Time}`;


    const button = document.createElement('button');
    button.className = 'take-attendance';
    button.id = 'takeAttendance';
    button.textContent = 'Take Attendance';

    // Assign click event listener to the "Take Attendance" button
    button.addEventListener('click', () => {
        // Generate a random attendance code
        const attendanceCode = "12345";  // replace this with a function to generate a random code

        // Generate a QR code with the attendance code
        new QRCode(document.getElementById('qrcode'), attendanceCode);

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;

                // Assign Latitude and Longitude
                const location_latitude = position.coords.latitude;
                const location_longitude = position.coords.longitude;

                // Here we use Fetch API to make a POST request to your '/add-lecture' route
                try {
                    const response = await fetch('/add-lecture', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: lecture.name,  // Add your actual lecture name here
                            lecture_date: new Date().toISOString(),  // Add your actual lecture date here
                            latitude: location_latitude,
                            longitude: location_longitude,
                            qr_code: attendanceCode,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    } else {
                        const result = await response.json();
                        console.log(result);
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation: ', error);
                }
            });
        } else {
            document.getElementById('location').textContent = 'Geolocation is not supported by this browser.';
        }

        // Show the popup
        document.querySelector('.popup-overlay').classList.add('active');
        document.getElementById('popupOverlay').style.display = "flex";
    });

    card.appendChild(h2);
    card.appendChild(p1);
    card.appendChild(p2);
    card.appendChild(p3);

    card.appendChild(button);

    return card;
}

// Function to fetch lectures for this week and display them in the container
async function fetchAndDisplayLectures() {
    try {
        const response = await fetch('/today-lectures', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const lectures = await response.json();

            const container = document.querySelector('.container');
            container.innerHTML = '';  // Clear the container

            if (lectures.length === 0) {
                // If there are no lectures, display a "No lectures found" message
                const message = document.createElement('h3');
                message.textContent = 'No lectures found for today.';
                container.appendChild(message);
            } else {

                // Generate and add a card for each lecture
                lectures.forEach(lecture => {
                    const card = createLectureCard(lecture);
                    container.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
}

// Call the function to fetch and display lectures
fetchAndDisplayLectures();