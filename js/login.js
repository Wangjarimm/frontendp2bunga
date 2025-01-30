document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');
    const loginUsername = document.querySelector('#username');
    const loginPassword = document.querySelector('#password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (username === "" || password === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username and password are required.'
            });
            return;
        }

        const loginData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8000/index.php/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.message === "Invalid credentials") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Credentials',
                    text: 'Invalid username or password.'
                });
            } else {
                const user = result;
                const role = user.role;

                // Simpan data customer ke localStorage jika role adalah customer
                if (role === "customer") {
                    localStorage.setItem('customerData', JSON.stringify({
                        id: user.id,            // Menambahkan ID user
                        name: user.name,
                        phone: user.phone,
                        email: user.email
                    }));

                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Redirecting to customer dashboard...',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "../customer/dashboard.html";
                    });
                } else if (role === "admin") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Redirecting to admin dashboard...',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "../admin/dashboardadmin.html";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unknown Role',
                        text: 'Unknown user role.'
                    });
                }
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
