const form = document.getElementById('loginForm');

form.addEventListener('submit', function (event) {
    // Prevent the form from being submitted the default way.
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/loginuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Redirect to the dashboard on successful login
                window.location.href = '/dashboard';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
