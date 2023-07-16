//first load semesters and courses so the teacher can select to see attendance history
document.addEventListener('DOMContentLoaded', (event) => {
    loadSemesters();

    document.getElementById('semesterSelect').addEventListener('change', function () {
        loadCourses(this.value);
    });

    document.getElementById('submitButton').addEventListener('click', function () {
        loadTableData();
    });
});

//logout logic
document.getElementById('logout').addEventListener('click', function () {
    localStorage.setItem('logout', 1);
    fetch('/logout', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Logged out successfully') {
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
});

//load courses
function loadSemesters() {
    fetch(`${url}/get-student-semester  `, {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(semester => {
            console.log("Data", semester);
            const semesterSelect = document.getElementById('semesterSelect');
            // data.semester.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester.semester.id;
            option.text = semester.semester.name + "-" + semester.semester.year;
            semesterSelect.add(option);
            // });

            // If semesters exist, load the courses for the first semester
            // if (data.semesters.length > 0) {
            //     loadCourses(data.semesters[0].id);
            // }

            semesterSelect.disabled = false;
            document.getElementById('submitButton').disabled = false;

            loadCourses(semester.semester.id);
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
}


//load courses
function loadCourses(semesterId) {
    fetch(`${url}/semester-user-courses?semesterid=${semesterId}`, {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Course Data: ", data)
            const courseSelect = document.getElementById('courseSelect');
            // Remove existing options
            while (courseSelect.firstChild) {
                courseSelect.firstChild.remove();
            }
            // Add new options
            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.text = course.name;
                courseSelect.add(option);
            });
            courseSelect.disabled = false;
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
}


//load table data
function loadTableData() {
    const semesterId = document.getElementById('semesterSelect').value;
    const courseId = document.getElementById('courseSelect').value;

    fetch(`${url}/user-course-lectures?courseid=${courseId}`, {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Lecture Data: ", data)
            // Reset the table data with the new lectures
            table.setData(data);
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
}

//tabulator code 
//Create Date Editor
var dateEditor = function (cell, onRendered, success, cancel) {
    var editor = document.createElement("input");
    editor.setAttribute("type", "date");
    editor.style.width = "100%";
    editor.style.height = "100%";
    editor.style.padding = "4px";
    editor.style.boxSizing = "border-box";
    editor.value = cell.getValue();
    onRendered(function () {
        editor.focus();
        editor.style.css = "100%";
    });
    function successFunc() {
        success(editor.value);
    }
    editor.addEventListener("change", successFunc);
    editor.addEventListener("blur", successFunc);
    return editor;
};

//Define Table
//Define Table
var table = new Tabulator("#table", {
    height: "311px",
    layout: "fitColumns",
    placeholder: "No Data Set",
    columns: [
        { title: "Lecture ID", field: "id", sorter: "number" },
        { title: "Course ID", field: "course_id", sorter: "number" },
        { title: "Lecture Date", field: "lecture_date", sorter: "date", editor: dateEditor },
        { title: "Start Time", field: "lecture_start_time", sorter: "string" },
        { title: "End Time", field: "lecture_end_Time", sorter: "string" },
        { title: "Course Name", field: "name", sorter: "string" },
        { title: "Attendance Status", field: "attendanceStatus", sorter: "string", editor: "select", editorParams: { values: ["Present", "Absent", "Late"] } },
    ],
});
