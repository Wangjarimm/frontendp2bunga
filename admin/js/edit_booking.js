$(document).ready(function () {
    // Get booking ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get("id");

    if (bookingId) {
        // Fetch booking data from API using the booking ID
        $.ajax({
            url: `http://localhost:8000/index.php/booking/${bookingId}`, // API endpoint to fetch specific booking
            method: "GET",
            success: function (response) {
                let booking = JSON.parse(response);

                if (booking) {
                    // Create form with booking data
                    let form = `
                    <form id="editBookingForm">
                        <input type="hidden" name="id_booking" value="${booking.id_booking}">
                        <input type="hidden" name="user_id" value="${booking.user_id}"> <!-- Tambahkan hidden input untuk user_id -->
                        <div class="form-group">
                            <label for="name">Customer Name</label>
                            <input type="text" id="name" name="name" class="form-control" value="${booking.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="text" id="phone" name="phone" class="form-control" value="${booking.phone}" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" value="${booking.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="total_price">Total Price</label>
                            <input type="number" id="total_price" name="total_price" class="form-control" value="${booking.total_price}" required>
                        </div>
                        <div class="form-group">
                            <label for="date">Booking Date</label>
                            <input type="date" id="date" name="date" class="form-control" value="${booking.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="payment_status">Payment Status</label>
                            <select id="payment_status" name="payment_status" class="form-control" required>
                                <option value="Completed" ${booking.payment_status === "Completed" ? "selected" : ""}>   Completed</option>
                                <option value="Pending" ${booking.payment_status === "Pending" ? "selected" : ""}>Pending</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                    `;
                    $("#edit-form-container").html(form);
                } else {
                    alert("Booking not found!");
                }
            },
            error: function () {
                alert("Failed to fetch booking data.");
            },
        });
    } else {
        alert("No booking ID provided!");
    }

    // Handle form submission
    $(document).on("submit", "#editBookingForm", function (e) {
        e.preventDefault();

        // Get form data
        let formData = $(this).serializeArray();  // Use serializeArray to get form data as an array
        let jsonData = {};

        // Convert formData into a JSON object
        formData.forEach(function (item) {
            jsonData[item.name] = item.value;
        });

        console.log("Form Data:", jsonData);  // Debugging to check the data being sent

        // Send data using PUT in JSON format
        $.ajax({
            url: `http://localhost:8000/index.php/booking/${bookingId}`,
            method: "PUT",
            contentType: "application/json",  // Set Content-Type header to application/json
            data: JSON.stringify(jsonData),  // Send data as JSON
            success: function (response) {
                console.log("Update Response:", response);  // Debugging to see the response
                alert("Booking updated successfully!");
                window.location.href = "./booking.html";  // Redirect to booking list after update
            },
            error: function () {
                alert("Failed to update booking.");
            },
        });
    });
});
