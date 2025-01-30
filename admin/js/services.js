$(document).ready(function () {
    // Fetch service data from API
    $.ajax({
      url: "http://localhost:8000/index.php/service", // API endpoint untuk mengambil data service
      method: "GET",
      success: function (response) {
        let services = Array.isArray(response) ? response : JSON.parse(response);
        let servicesTable = $("#servicesData");
        servicesTable.empty();
    
        services.forEach(function (service, index) {
          let sequentialId = index + 1;
          let formattedPrice = formatRupiah(service.harga); // Menggunakan fungsi yang diperbaiki
    
          let row = `<tr>
          <td>${sequentialId}</td>
          <td>${service.nama_service}</td>
          <td>${formattedPrice}</td>
          <td>${service.deskripsi}</td>
          <td><img src="uploads/${service.foto}" alt="Service Image" width="100" height="100"></td>
          <td>
              <a href="edit_service.html?id=${service.id}" class="btn btn-primary btn-sm">Edit</a>
              <a href="#" class="btn btn-danger btn-sm" onclick="deleteService(${service.id})">Delete</a>
          </td>
        </tr>`;
          servicesTable.append(row);
        });
      },
      error: function () {
        alert("Failed to fetch service data.");
      },
    });
  });
  
  // Function to format number to Rupiah
  function formatRupiah(angka) {
    let number = typeof angka === "number" ? angka : parseFloat(angka);
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  }
  
  // Function to confirm deletion and delete service
  function deleteService(serviceId) {
    if (confirm("Are you sure you want to delete this service?")) {
      $.ajax({
        url: `http://localhost:8000/index.php/service/${serviceId}`,
        method: "DELETE",
        success: function () {
          alert("Service deleted successfully!");
          location.reload();
        },
        error: function () {
          alert("Failed to delete service.");
        },
      });
    }
  }

  $(document).ready(function () {
    $("#addServiceForm").submit(function (event) {
        event.preventDefault();

        let formData = {
            name: $("#name").val(),
            price: $("#price").val(),
            description: $("#description").val(),
            photo: $("#photo").val() // URL gambar
        };

        $.ajax({
            url: "http://localhost:8000/index.php/service",
            method: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json", // Pastikan dikirim sebagai JSON
            success: function (response) {
                let result = typeof response === "object" ? response : JSON.parse(response);
                if (result.success) {
                    alert("Service successfully added!");
                    window.location.href = "services.html";
                } else {
                    alert("Failed to add service: " + result.message);
                }
            },
            error: function () {
                alert("An error occurred while adding service.");
            },
        });
    });
});


  