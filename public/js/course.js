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

async function fetchCourses() {
    try {
        const response = await fetch(`${url}/get-student-semester`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error fetching student semester');
        }

        const semester = data.semester;

        // Fetch all the courses for the semester
        const coursesResponse = await fetch(`${url}/get-semester-courses/${semester.id}`, {
            credentials: 'include'
        });
        const allCourses = await coursesResponse.json();

        // Fetch the user's courses
        const userCoursesResponse = await fetch(`${url}/user-courses`, {
            credentials: 'include'
        });
        const userCourses = await userCoursesResponse.json();

        // Filter out the user's courses from all courses
        const otherCourses = allCourses.filter(course => !userCourses.find(userCourse => userCourse.id === course.id));

        const userCoursesList = document.querySelector('.user-courses-list');
        const otherCoursesList = document.querySelector('.other-courses-list');

        userCoursesList.innerHTML = userCourses.length > 0 ? '' : 'You have not enrolled in any courses.';
        otherCoursesList.innerHTML = '';

        userCourses.forEach(course => {
            const courseCard = createCourseCard(course, false);
            userCoursesList.appendChild(courseCard);
        });

        otherCourses.forEach(course => {
            const courseCard = createCourseCard(course, true);
            otherCoursesList.appendChild(courseCard);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function createCourseCard(course, isSelectable) {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
        <h2>${course.name}</h2>
        <p> Start Date: ${course.start}</p>
        <p> End Date: ${course.end}</p>
        <p> Start Time: ${course.startTime}</p>
        <p> End Time: ${course.endTime}</p>
        <p> Days of Week: ${course.daysOfWeek}</p>
        ${isSelectable ? `<button id="${course.id}" class="addCourse">Add Course</button>` : ''}
    `;

    if (isSelectable) {
        courseCard.querySelector('.addCourse').addEventListener('click', function (event) {
            addCourse(event.target.id);
        });
    }

    return courseCard;
}

// fetchCourses(); // Call the function here after it is defined.

fetchCourses(); // Call the function here after it is defined.

//add course function
async function addCourse(courseId) {
    try {
        const response = await fetch(`${url}/add-student-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId: courseId }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error adding course');
        }

        Swal.fire({
            title: 'Success',
            text: 'Course added successfully',
            icon: 'success'
        });

        // Hide the "Add Course" button
        document.getElementById(courseId).style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
    }
}


