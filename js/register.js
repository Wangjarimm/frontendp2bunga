document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form');
    const nameInput = document.querySelector('#name');
    const phoneInput = document.querySelector('#phone');
    const genderSelect = document.querySelector('#jenis_kelamin');
    const addressInput = document.querySelector('#alamat');
    const emailInput = document.querySelector('#email');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const confirmInput = document.querySelector('#confirm');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form values
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const gender = genderSelect.value;
        const address = addressInput.value.trim();
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();

        // Simple validation
        if (!name || !phone || !address || !email || !username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required.'
            });
            return;
        }

        // Check if gender is selected and not default
        if (!gender || gender === 'Pilih Jenis Kelamin') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select your gender.'
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match.'
            });
            return;
        }

        const userData = {
            username: username,
            password: password,
            name: name,
            phone: phone,
            gender: gender,
            address: address,
            role: "customer", // Default role for registration
            email: email,
        };

        try {
            const response = await fetch("http://localhost:8000/index.php/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("Failed to register");
            }

            const result = await response.json();

            if (result.message === "Registration successful.") {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'Please login.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "../login.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: result.message
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again later.'
            });
            console.error(error);
        }
    });
});
