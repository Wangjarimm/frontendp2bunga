$(document).ready(function () {
    // Fetch booking data from API
    $.ajax({
        url: 'http://localhost:8000/index.php/booking', // API endpoint for bookings
        method: 'GET',
        success: function (response) {
            console.log('API Response:', response); // Debug API response
            let bookings;
            try {
                bookings = JSON.parse(response); // Parse the JSON response
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid API response format.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            let bookingTable = $('#bookingData');
            bookingTable.empty();

            // Iterate over bookings
            bookings.forEach(function (booking, index) {
                // Convert services array to a comma-separated string
                let servicesList = booking.services
                    ? booking.services.map(service => service.nama_service).join(', ')
                    : 'No services selected';

                // Calculate sequential ID (index + 1)
                let sequentialId = index + 1;

                // Format total price using formatRupiah function
                let formattedPrice = formatRupiah(booking.total_price);

                // Create table row
                let row = `<tr>
                            <td>${sequentialId}</td>
                            <td>${booking.name}</td>
                            <td>${booking.phone}</td>
                            <td>${booking.email}</td>
                            <td>${booking.date}</td>
                            <td>${formattedPrice}</td> <!-- Formatted total price -->
                            <td>${servicesList}</td> <!-- Display selected services -->
                            <td>${booking.payment_status}</td>
                            <td>
                                <a href="edit_booking.html?id=${booking.id_booking}" class="btn btn-primary btn-sm">Edit</a>
                                <a href="#" class="btn btn-danger btn-sm" onclick="deleteBooking(${booking.id_booking})">Delete</a>
                            </td>
                        </tr>`;
                bookingTable.append(row);
            });
        },
        error: function () {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch booking data.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});

// Function to format number to Rupiah
function formatRupiah(angka) {
    let number = typeof angka === "number" ? angka : parseFloat(angka);
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Function to confirm deletion and delete booking
function deleteBooking(bookingId) {
    console.log("Booking ID to delete:", bookingId); // Debugging ID yang dikirim
    // Confirm deletion
    Swal.fire({
        title: 'Are you sure you want to delete this booking?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Call API to delete booking
            $.ajax({
                url: `http://localhost:8000/index.php/booking/${bookingId}`, // Pastikan ID ada di URL
                method: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Booking deleted successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        location.reload(); // Reload halaman untuk update tampilan
                    });
                },
                error: function () {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete booking.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}

// Logout confirmation using SweetAlert
document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    Swal.fire({
        title: "Apakah Anda yakin ingin logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, logout",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to the logout URL
            window.location.href = "../index.html";
        }
    });
});
