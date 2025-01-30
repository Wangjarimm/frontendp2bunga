document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk memformat angka menjadi Rupiah
  function formatRupiah(angka) {
    return "Rp. " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Ambil data customer dari localStorage
  const customerData = JSON.parse(localStorage.getItem("customerData"));

  // Memeriksa apakah data customer ada
  if (customerData) {
    document.querySelector('input[name="name"]').value = customerData.name;
    document.querySelector('input[name="phone"]').value = customerData.phone;
    document.querySelector('input[name="email"]').value = customerData.email;
  } else {
    alert("Data customer tidak ditemukan. Anda harus login terlebih dahulu.");
    window.location.href = "../../login.html"; // Redirect ke halaman login jika tidak ada data
  }

  // Ambil data layanan yang dipilih dari localStorage
  const selectedServices =
    JSON.parse(localStorage.getItem("selectedServices")) || [];

  // Memeriksa jika ada layanan yang dipilih
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
            <div class="cart_total_price ml-auto">${formatRupiah(
              totalPrice
            )}</div>
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

  // Tambahkan event listener untuk tombol booking
  document
    .getElementById("bookingButton")
    .addEventListener("click", function (event) {
      event.preventDefault();

      // Ambil tanggal yang dipilih oleh pengguna
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
        name: document.querySelector('input[name="name"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        email: document.querySelector('input[name="email"]').value,
        total_price: calculateTotalPrice(selectedServices),
        date: bookingDate, // Gunakan tanggal yang dipilih oleh pengguna
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
          // Gabungkan bookingData dengan booking_id yang diterima dari server
          const completeBookingData = {
            ...bookingData,
            booking_id: data.booking_id,
          };

          // Simpan completeBookingData ke localStorage
          localStorage.setItem(
            "latestBooking",
            JSON.stringify(completeBookingData)
          );
          if (
            data.message === "Booking successfully created." &&
            data.booking_id
          ) {
            Swal.fire({
              icon: "success",
              title: "Booking Berhasil",
              text: "Transaksi Anda telah berhasil dibuat!",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.href = "./confirmation.html"; // Redirect ke halaman konfirmasi
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Booking Gagal",
              text: "Terjadi kesalahan saat membuat transaksi.",
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
        window.location.href = "../../../index.html"; // Redirect ke halaman logout
      }
    });
  });
});
