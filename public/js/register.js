document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const institution = document.getElementById('institution').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-repeat').value;

    // Perform client-side validation if needed

    try {
        const response = await fetch('/registeruser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                institution,
                username,
                email,
                password,
                confirmPassword,
            }),
        });

        if (response.ok) {
            // Registration successful, redirect to the login page
            window.location.href = '/login';
        } else {
            // Handle registration error
            const errorData = await response.json();
            alert(errorData.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});