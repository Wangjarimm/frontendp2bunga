$(document).ready(function() {
    // Fetch customer data from API
    $.ajax({
        url: 'http://localhost:8000/index.php/customer', // API endpoint
        method: 'GET',
        success: function(response) {
            let customers = JSON.parse(response);
            let customerTable = $('#customerData');
            customerTable.empty();

            // Filter customers based on role (only "customer" role)
            let filteredCustomers = customers.filter(function(customer) {
                return customer.role === 'customer'; // Only display customers with role "customer"
            });

            // Iterate over filtered customers
            filteredCustomers.forEach(function(customer, index) {
                // Calculate sequential ID (index + 1)
                let sequentialId = index + 1;

                // Create table row, exclude password, created_at, and role
                let row = `<tr>
                            <td>${sequentialId}</td> <!-- Display sequential ID -->
                            <td>${customer.name}</td> <!-- Display name -->
                            <td>${customer.username}</td> <!-- Display username -->
                            <td>${customer.phone}</td> <!-- Display phone -->
                            <td>${customer.gender}</td> <!-- Display gender -->
                            <td>${customer.address}</td> <!-- Display address -->
                            <td>${customer.email}</td> <!-- Display email -->
                            <td>
                                <a href="edit_customer.html?id=${customer.id}" class="btn btn-primary btn-sm">Edit</a>
                                <a href="#" class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">Delete</a>
                            </td>
                        </tr>`;
                customerTable.append(row);
            });
        },
        error: function() {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch customer data.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});

// Function to confirm deletion and delete customer
function deleteCustomer(customerId) {
    // Confirm deletion using SweetAlert
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this customer?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
    }).then((result) => {
        if (result.isConfirmed) {
            // Call API to delete customer
            $.ajax({
                url: `http://localhost:8000/index.php/customer/${customerId}`, // API endpoint for deleting customer
                method: 'DELETE',
                success: function(response) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Customer deleted successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        location.reload(); // Reload the page to reflect changes after user presses "OK"
                    });
                },
                error: function() {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete customer.',
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
