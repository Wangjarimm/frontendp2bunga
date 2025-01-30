document.addEventListener("DOMContentLoaded", function () {
  // Array untuk menyimpan layanan yang dipilih
  let selectedServices = [];

  function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Mengambil data layanan biasa dari backend
  fetch("http://localhost:8000/index.php/service")
    .then((response) => response.json())
    .then((services) => {
      console.log(services); // Cek data layanan yang diterima dari backend

      // Menampilkan layanan biasa
      if (services.length > 0) {
        const serviceList = document.getElementById("service-list");

        services.forEach((service) => {
          const formattedPrice = formatRupiah(service.harga); // Format harga ke Rupiah
          const serviceCard = document.createElement("div");
          serviceCard.classList.add(
            "col-md-4",
            "d-flex",
            "align-items-stretch"
          );

          serviceCard.innerHTML = `
                      <div class="service-card w-100" data-id="${service.id}">
                          <div class="best_buy">+</div>
                          <img src="../../admin/uploads/${service.foto}" alt="${service.nama_service}">
                          <h5>${service.nama_service}</h5>
                          <p>${service.deskripsi}</p>
                          <p><strong>Price: ${formattedPrice}</strong></p>
                      </div>
                  `;

          // Menambahkan event listener untuk memilih layanan
          const bestBuyButton = serviceCard.querySelector(".best_buy");
          bestBuyButton.addEventListener("click", function () {
            const serviceId = service.id;
            const serviceData = {
              id: service.id,
              nama_service: service.nama_service,
              harga: service.harga,
              deskripsi: service.deskripsi,
              foto: service.foto,
            };

            if (selectedServices.some((service) => service.id === serviceId)) {
              // Jika layanan sudah dipilih, hapus dari daftar pilihan
              selectedServices = selectedServices.filter(
                (s) => s.id !== serviceId
              );
              bestBuyButton.classList.remove("selected");
            } else {
              // Jika layanan belum dipilih, tambahkan ke daftar pilihan
              selectedServices.push(serviceData);
              bestBuyButton.classList.add("selected");
            }

            console.log("Selected services:", selectedServices);
          });

          serviceList.appendChild(serviceCard);
        });
      } else {
        console.log("No services available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching services:", error);
    });

  // Mengambil data layanan yang sering dipesan dari backend
  fetch("http://localhost:8000/index.php/most-ordered-services")
    .then((response) => response.json())
    .then((mostOrderedServices) => {
      console.log("Most ordered services response:", mostOrderedServices); // Tambahkan ini
      mostOrderedServices.forEach((service) => {
        console.log("Service data:", service); // Tambahkan ini
      });
      if (mostOrderedServices.length > 0) {
        const mostOrderedServiceList = document.getElementById(
          "most-ordered-service-list"
        );

        mostOrderedServices.forEach((service) => {
          const formattedPrice = formatRupiah(service.harga); // Format harga ke Rupiah
          const serviceCard = document.createElement("div");
          serviceCard.classList.add(
            "col-md-4",
            "d-flex",
            "align-items-stretch"
          );

          serviceCard.innerHTML = `
                      <div class="service-card w-100" data-id="${service.service_id}">
                          <img src="../../admin/uploads/${service.foto}" alt="${service.nama_service}">
                          <h5>${service.nama_service}</h5>
                          <p><strong>Price: ${formattedPrice}</strong></p>
                          <p>Ordered: ${service.total_ordered} times</p> <!-- Tampilkan jumlah pemesanan -->
                      </div>
                  `;

          mostOrderedServiceList.appendChild(serviceCard);
        });
      } else {
        console.log("No most ordered services available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching most ordered services:", error);
    });

  // Menangani klik pada tombol "Pesan Layanan"
  const submitServicesButton = document.getElementById("submit-services");
  submitServicesButton.addEventListener("click", function () {
    if (selectedServices.length === 0) {
      // Menampilkan SweetAlert jika tidak ada layanan yang dipilih
      Swal.fire({
        icon: "warning",
        title: "Pilih Layanan",
        text: "Silakan pilih layanan terlebih dahulu sebelum melanjutkan.",
        confirmButtonText: "OK",
      });
    } else {
      // Menampilkan SweetAlert untuk konfirmasi
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan memesan layanan yang dipilih.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, pesan!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Simpan layanan yang dipilih ke localStorage dan arahkan ke halaman transaksi
          localStorage.setItem(
            "selectedServices",
            JSON.stringify(selectedServices)
          );
          window.location.href = "../customer/page/booking/booking.html"; // Ganti dengan halaman transaksi yang sesuai
        }
      });
    }
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
});
