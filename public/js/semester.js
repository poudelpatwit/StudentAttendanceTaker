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

//user will select the semester and then once the semester is selected default semester will be shown.
async function fetchSemesters() {
    try {
        const response = await fetch(`${url}/get-student-semester`, {
            credentials: 'include'
        });
        const data = await response.json();
        console.log("Student Semester: ", data);

        if (!response.ok) {
            // if () {

            // Show a SweetAlert popup
            Swal.fire({
                title: 'You have not configured a semester',
                text: 'Please select one from this page.',
                icon: 'info',
                confirmButtonText: 'OK'
            }).then(async result => {
                if (result.isConfirmed) {
                    // If the user clicks OK, fetch all semesters
                    const allSemestersResponse = await fetch(`${url}/get-all-semesters`, {
                        credentials: 'include'
                    });
                    // assuming the response is an array of semester objects
                    const allSemestersData = await allSemestersResponse.json();
                    console.log("All semesters: ", allSemestersData);

                    const semesterList = document.querySelector('.card');
                    semesterList.innerHTML = '';

                    allSemestersData.semesters.forEach((semester) => {
                        const card = document.createElement('div');
                        card.classList.add('semester-card');
                        card.innerHTML = `
                                <h2>${semester.name} ${semester.year}</h2>
                                <p>Start: ${semester.start}</p>
                                <p>End: ${semester.end}</p>
                                <button id="${semester.id}" class="selectSemester">Select</button>
                                `;

                        // Add an event listener to the "Select" button
                        card.querySelector('.selectSemester').addEventListener('click', function (event) {
                            selectSemester(event.target.id);
                        });

                        semesterList.appendChild(card);
                    });
                }
            });
        }

        const semesterList = document.querySelector('.card');
        semesterList.innerHTML = '';

        const semester = data.semester;

        // data.semesters.forEach((semester) => {
        const card = document.createElement('div');
        card.classList.add('semester-card');
        card.innerHTML = `
                    <h2>${semester.name} ${semester.year}</h2>
                    <p>Start: ${semester.start}</p>
                    <p>End: ${semester.end}</p>`
        // <button id="${semester.name}" class="selectSemester">Select</button>
        // `;
        semesterList.appendChild(card);
        // });
        // }
        // {
        //     console.error('Error:', response.statusText);
        // }
    } catch (error) {
        console.error('Error:', error);
    }
}


fetchSemesters(); // Call the function here after it is defined.

//function will add the selected semester by the student
async function selectSemester(semesterId) {
    try {
        const response = await fetch(`${url}/add-student-semester-using-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ semesterId }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error:', response.statusText);
            // Handle error...
        } else {
            Swal.fire({
                title: 'You have successfully selected a semester!!',
                text: 'Semester has been added to your list. You can now go to course tab and add courses based on the semester.',
                icon: 'success'
            });
            //call fetch semesters again after the semester has been added.
            fetchSemesters();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
