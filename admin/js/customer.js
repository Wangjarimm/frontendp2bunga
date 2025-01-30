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
            alert('Failed to fetch customer data.');
        }
    });
});

// Function to confirm deletion and delete customer
function deleteCustomer(customerId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this customer?')) {
        // Call API to delete customer
        $.ajax({
            url: `http://localhost:8000/index.php/customer/${customerId}`, // API endpoint for deleting customer
            method: 'DELETE',
            success: function(response) {
                alert('Customer deleted successfully!');
                location.reload(); // Reload the page to reflect changes
            },
            error: function() {
                alert('Failed to delete customer.');
            }
        });
    }
}
