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
      Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch service data.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
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
  Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: `http://localhost:8000/index.php/service/${serviceId}`,
              method: "DELETE",
              success: function () {
                  Swal.fire({
                      title: 'Deleted!',
                      text: 'Service deleted successfully!',
                      icon: 'success',
                      confirmButtonText: 'OK'
                  }).then(() => {
                      location.reload();
                  });
              },
              error: function () {
                  Swal.fire({
                      title: 'Error!',
                      text: 'Failed to delete service.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              },
          });
      }
  });
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
                  Swal.fire({
                      title: 'Success!',
                      text: 'Service successfully added!',
                      icon: 'success',
                      confirmButtonText: 'OK'
                  }).then(() => {
                      window.location.href = "services.html";
                  });
              } else {
                  Swal.fire({
                      title: 'Error!',
                      text: 'Failed to add service: ' + result.message,
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          },
          error: function () {
              Swal.fire({
                  title: 'Error!',
                  text: 'An error occurred while adding service.',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          },
      });
  });
});

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
