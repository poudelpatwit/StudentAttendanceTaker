document.getElementById('logout').addEventListener('click', function () {
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

document.addEventListener('DOMContentLoaded', () => {
    // Get the username from localStorage
    const username = localStorage.getItem('username');

    // Update the user's welcome message with their username
    const userElement = document.querySelector('.username');
    userElement.textContent = `${username}`;

});

//bar graph of student attendance
(async function () {
    const data = {
        labels: [
            "name1",
            "name2",
            "name3",
            "name4",
            "name5"
        ],
        datasets: [
            {
                label: "Time Attended",
                backgroundColor: 'rgba(22, 23, 72, 0.6)',
                borderColor: 'rgb(22, 23, 72)',
                borderWidth: 1,
                data: [100, 200, 240, 240, 60]
            },
            {
                label: "Classes Attended",
                backgroundColor: 'rgba(57, 160, 202, 0.6)',
                borderColor: 'rgb(57, 160, 202)',
                borderWidth: 1,
                data: [160, 240, 240, 240, 80]
            },
        ]
    };
    const chartOptions = {
        responsive: true,
        legend: {
            position: "top"
        },
        title: {
            display: true,
            text: "Chart.js Bar Chart"
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }

    new Chart(
        document.getElementById('classes_attended'),
        {
            type: 'bar',
            data: data,
            options: chartOptions
        }
    );
})();

//doughnut chart for percent of classes 
//attended by all students
(async function () {
    const data = [92, 9];

    new Chart(
        document.getElementById('percent_classes_attended'),
        {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        label: 'Percent Attended',
                        data: data,
                        backgroundColor: ['rgba(71, 133, 89, 0.6)', 'rgba(0, 0, 0, 0)'],
                        borderColor: ['rgb(71, 133, 89)', 'rgba(0, 0, 0, 0)'],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Percent of Classes Attended'
                    }
                }
            }
        }
    );
})();

//doughnut chart for percent of time 
//spent in class by all students
(async function () {
    const data = [80, 20];

    new Chart(
        document.getElementById('percent_time_classes_attended'),
        {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        label: 'Percent Attended',
                        data: data,
                        backgroundColor: ['rgba(71, 133, 89, 0.6)', 'rgba(0, 0, 0, 0)'],
                        borderColor: ['rgb(71, 133, 89)', 'rgba(0, 0, 0, 0)'],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Percent of Time Spent in Class'
                    }
                }
            }
        }
    );
})();