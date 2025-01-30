$(document).ready(function () {
    // Get service ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get("id");

    if (serviceId) {
        // Fetch service data from API using the service ID
        $.ajax({
            url: `http://localhost:8000/index.php/service/${serviceId}`, // API endpoint to fetch specific service
            method: "GET",
            success: function (response) {
                let service = JSON.parse(response);

                if (service) {
                    // Create form with service data
                    let form = `
                        <form id="editServiceForm">
                            <input type="hidden" name="id" value="${service.id}">
                            <div class="form-group">
                                <label for="name">Service Name</label>
                                <input type="text" id="name" name="name" class="form-control" value="${service.nama_service}" required>
                            </div>
                            <div class="form-group">
                                <label for="price">Price</label>
                                <input type="text" id="price" name="price" class="form-control" value="${service.harga}" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Description</label>
                                <textarea id="description" name="description" class="form-control" required>${service.deskripsi}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="photo">Photo</label>
                                <input type="text" id="photo" name="photo" class="form-control" value="${service.foto}" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    `;
                    $("#edit-form-container").html(form);
                } else {
                    alert("Service not found!");
                }
            },
            error: function () {
                alert("Failed to fetch service data.");
            },
        });
    } else {
        alert("No service ID provided!");
    }

    // Handle form submission
    $(document).on("submit", "#editServiceForm", function (e) {
        e.preventDefault();

        // Get form data
        let formData = $(this).serializeArray(); // Get data in array format
        let jsonData = {};

        // Convert formData to JSON object
        formData.forEach(function (item) {
            jsonData[item.name] = item.value;
        });

        console.log("Form Data:", jsonData); // Debugging to check the data being sent

        // Send data with PUT in JSON format
        $.ajax({
            url: `http://localhost:8000/index.php/service/${serviceId}`,
            method: "PUT",
            contentType: "application/json", // Set Content-Type header to application/json
            data: JSON.stringify(jsonData), // Send data in JSON format
            success: function (response) {
                console.log("Update Response:", response); // Debugging to view the response
                alert("Service updated successfully!");
                window.location.href = "./services.html"; // Redirect to the services list page after a successful update
            },
            error: function () {
                alert("Failed to update service.");
            },
        });
    });
});
