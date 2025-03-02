document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk memformat angka menjadi Rupiah
  function formatRupiah(angka) {
    return "Rp. " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Ambil data customer dari localStorage
  const customerData = JSON.parse(localStorage.getItem("customerData"));

  if (customerData) {
    document.querySelector('input[name="name"]').value = customerData.name;
    document.querySelector('input[name="phone"]').value = customerData.phone;
    document.querySelector('input[name="email"]').value = customerData.email;
  } else {
    alert("Data customer tidak ditemukan. Anda harus login terlebih dahulu.");
    window.location.href = "../../login.html"; // Redirect ke login jika tidak ada data
  }

  // Ambil data layanan yang dipilih dari localStorage
  const selectedServices =
    JSON.parse(localStorage.getItem("selectedServices")) || [];

  if (selectedServices.length > 0) {
    const cartTotalElement = document.querySelector(".cart_total");
    let totalPrice = 0;

    selectedServices.forEach((service) => {
      const serviceItem = document.createElement("li");
      serviceItem.classList.add(
        "d-flex",
        "flex-row",
        "align-items-center",
        "justify-content-start"
      );

      serviceItem.innerHTML = `
        <div class="cart_total_title">${service.nama_service}</div>
        <div class="cart_total_price ml-auto">${formatRupiah(
          service.harga
        )}</div>
      `;

      cartTotalElement.appendChild(serviceItem);
      totalPrice += parseFloat(service.harga);
    });

    const totalRow = document.createElement("li");
    totalRow.classList.add(
      "d-flex",
      "flex-row",
      "align-items-start",
      "justify-content-start",
      "total_row"
    );
    totalRow.innerHTML = `
      <div class="cart_total_title">Total</div>
      <div class="cart_total_price ml-auto">${formatRupiah(totalPrice)}</div>
    `;
    cartTotalElement.appendChild(totalRow);
  } else {
    Swal.fire({
      icon: "warning",
      title: "Layanan Belum Dipilih",
      text: "Anda belum memilih layanan. Silakan kembali dan pilih layanan yang diinginkan.",
      confirmButtonText: "OK",
    });
  }

  // Event listener untuk tombol booking
  document
    .getElementById("bookingButton")
    .addEventListener("click", function (event) {
      event.preventDefault();

      const bookingDate = document.querySelector('input[name="date"]').value;

      if (!bookingDate) {
        Swal.fire({
          icon: "error",
          title: "Tanggal belum dipilih",
          text: "Silakan pilih tanggal booking.",
          confirmButtonText: "OK",
        });
        return;
      }

      const bookingData = {
        user_id: customerData.id,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        total_price: calculateTotalPrice(selectedServices),
        date: bookingDate,
        payment_status: "pending",
        services: selectedServices.map((service) => service.id),
      };

      fetch("http://localhost:8000/index.php/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (
            data.message === "Booking successfully created." &&
            data.booking_id
          ) {
            // Simpan booking ke localStorage sebagai riwayat
            const newBooking = {
              ...bookingData,
              booking_id: data.booking_id,
              services: selectedServices, // Simpan seluruh objek layanan, bukan hanya ID
            };

            let bookingHistory =
              JSON.parse(localStorage.getItem("bookingHistory")) || [];
            bookingHistory.push(newBooking);
            localStorage.setItem(
              "bookingHistory",
              JSON.stringify(bookingHistory)
            );

            Swal.fire({
              icon: "success",
              title: "Booking Berhasil",
              text: "Booking Anda telah berhasil disimpan! Silakan datang ke salon untuk pembayaran.",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.href = "../../dashboard.html"; // Kembali ke dashboard
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Booking Gagal",
              text: "Terjadi kesalahan saat membuat booking.",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          console.error("Error during fetch:", error);
        });
    });

  // Fungsi untuk menghitung total harga
  function calculateTotalPrice(services) {
    return services.reduce(
      (total, service) => total + parseFloat(service.harga),
      0
    );
  }

  // Logout confirmation
  document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../../../index.html";
      }
    });
  });
});
