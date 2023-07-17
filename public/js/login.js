document.getElementById('loginForm').addEventListener('submit', async (event) => {
    // Prevent the form from being submitted the default way.
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${url}/loginuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Store username in local storage
                localStorage.setItem('username', username);
                // Redirect to the dashboard on successful login
                // window.location.href = '/dashboard';
                window.location.href = '/attendance';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
