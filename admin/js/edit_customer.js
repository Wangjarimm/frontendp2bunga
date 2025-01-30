$(document).ready(function () {
  // Get customer ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get("id");

  if (customerId) {
    // Fetch customer data from API using the customer ID
    $.ajax({
      url: `http://localhost:8000/index.php/customer/${customerId}`, // API endpoint to fetch specific customer
      method: "GET",
      success: function (response) {
        let customer = JSON.parse(response);

        if (customer) {
          // Create form with customer data
          let form = `
                          <form id="editCustomerForm">
                              <input type="hidden" name="id" value="${
                                customer.id
                              }">
                              <div class="form-group">
                                  <label for="name">Name</label>
                                  <input type="text" id="name" name="name" class="form-control" value="${
                                    customer.name
                                  }" required>
                              </div>
                              <div class="form-group">
                                  <label for="username">Username</label>
                                  <input type="text" id="username" name="username" class="form-control" value="${
                                    customer.username
                                  }" required>
                              </div>
                              <div class="form-group">
                                  <label for="phone">Phone</label>
                                  <input type="text" id="phone" name="phone" class="form-control" value="${
                                    customer.phone
                                  }" required>
                              </div>
                              <div class="form-group">
                                  <label for="gender">Gender</label>
                                  <select id="gender" name="gender" class="form-control" required>
                                      <option value="Laki-laki" ${
                                        customer.gender === "Laki-laki"
                                          ? "selected"
                                          : ""
                                      }>Laki-laki</option>
                                      <option value="Perempuan" ${
                                        customer.gender === "Perempuan"
                                          ? "selected"
                                          : ""
                                      }>Perempuan   </option>
                                      <option value="other" ${
                                        customer.gender === "other"
                                          ? "selected"
                                          : ""
                                      }>Other</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label for="address">Address</label>
                                  <textarea id="address" name="address" class="form-control" required>${
                                    customer.address
                                  }</textarea>
                              </div>
                              <div class="form-group">
                                  <label for="email">Email</label>
                                  <input type="email" id="email" name="email" class="form-control" value="${
                                    customer.email
                                  }" required>
                              </div>
                              <button type="submit" class="btn btn-primary">Save Changes</button>
                          </form>
                      `;
          $("#edit-form-container").html(form);
        } else {
          alert("Customer not found!");
        }
      },
      error: function () {
        alert("Failed to fetch customer data.");
      },
    });
  } else {
    alert("No customer ID provided!");
  }

  // Handle form submission
// Handle form submission
$(document).on("submit", "#editCustomerForm", function (e) {
    e.preventDefault();

    // Ambil data form
    let formData = $(this).serializeArray();  // Gunakan serializeArray untuk ambil data dalam format array
    let jsonData = {};

    // Mengubah formData menjadi objek JSON
    formData.forEach(function (item) {
        jsonData[item.name] = item.value;
    });

    console.log("Form Data:", jsonData);  // Debugging untuk memeriksa data yang dikirim

    // Kirim data dengan PUT dalam format JSON
    $.ajax({
        url: `http://localhost:8000/index.php/customer/${customerId}`,
        method: "PUT",
        contentType: "application/json",  // Set header Content-Type menjadi application/json
        data: JSON.stringify(jsonData),  // Mengirim data dalam format JSON
        success: function (response) {
            console.log("Update Response:", response);  // Debugging untuk melihat respon
            alert("Customer updated successfully!");
            window.location.href = "./customer.html";  // Redirect ke halaman index.html setelah update berhasil
        },
        error: function () {
            alert("Failed to update customer.");
        },
    });
});



});
