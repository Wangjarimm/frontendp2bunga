$(document).ready(function () {
    let isFiltered = false;

    $('#filterButton').on('click', function () {
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();
        let paymentStatus = $('#paymentStatus').val(); // Ambil nilai dari dropdown

       // Izinkan filter hanya berdasarkan payment status
    if (startDate && endDate) {
        fetchBookingData(startDate, endDate, paymentStatus);
    } else if (paymentStatus) {
        fetchBookingData('', '', paymentStatus); // Kirim request tanpa tanggal
    } else {
        alert('Silakan pilih tanggal mulai dan tanggal akhir atau pilih status pembayaran.');
    }
    
    isFiltered = true;
    });

    function fetchBookingData(startDate = '', endDate = '', paymentStatus = '') {
        let url = 'http://localhost:8000/index.php/booking';
    
        // Jika filter tanggal dipilih, gunakan endpoint khusus range
        if (startDate && endDate) {
            url = `http://localhost:8000/index.php/range?start_date=${startDate}&end_date=${endDate}`;
        }
    
        console.log('Requesting URL:', url);
    
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                let bookings;
                try {
                    bookings = JSON.parse(response);
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    alert('Format respons API tidak valid.');
                    return;
                }
    
                let bookingTable = $('#bookingData');
                bookingTable.empty();
    
                if (Array.isArray(bookings)) {
                    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

                    // Filter berdasarkan payment status di frontend jika ada
                    let filteredBookings = bookings.filter(booking => {
                        return paymentStatus ? booking.payment_status === paymentStatus : true;
                    });

                    // Hitung total booking sesuai filter
                    let totalBookings = filteredBookings.length;

                    let totalRevenue = 0;
                    let completedBookings = 0;

                    if (paymentStatus !== 'Pending') {
                        completedBookings = filteredBookings.filter(booking => booking.payment_status === 'Completed').length;
                        totalRevenue = filteredBookings
                            .filter(booking => booking.payment_status === 'Completed')
                            .reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0);
                    }


                    // Tampilkan total booking dan booking yang selesai
                    $('#totalBookings').text(`Total Booking: ${totalBookings}`);
                    $('#completedBookings').text(`Booking Selesai: ${completedBookings}`);
                    $('#totalRevenue').text(`Total Pendapatan: ${formatRupiah(totalRevenue)}`);

    
                    filteredBookings.forEach((booking, index) => {
                        let servicesList = booking.services ? booking.services.map(service => service.nama_service).join(', ') : 'No services selected';
                        let formattedPrice = formatRupiah(booking.total_price);
                        let formattedDate = formatDate(booking.date);
    
                        let row = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${booking.name}</td>
                                    <td>${booking.phone}</td>
                                    <td>${booking.email}</td>
                                    <td>${formattedDate}</td>
                                    <td>${formattedPrice}</td>
                                    <td>${servicesList}</td>
                                    <td>${booking.payment_status}</td>
                                </tr>`;
                        bookingTable.append(row);
                    });
    
                    $('#generatePDFButton').prop('disabled', false);
    
                    // Hanya tampilkan SweetAlert jika ada filter
                    if (startDate || endDate || paymentStatus) {
                        Swal.fire({
                            title: 'Data berhasil difilter!',
                            text: `Dari ${startDate || 'Semua'} hingga ${endDate || 'Semua'}, Status: ${paymentStatus || 'Semua'}`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    }
                } else {
                    alert('Data tidak ditemukan atau format respons API tidak valid.');
                }
            },
            error: function () {
                alert('Gagal mengambil data booking.');
            }
        });
    }
    

    fetchBookingData();

    $('#generatePDFButton').on('click', function () {
        generatePDF();
    });
});


// Function to format date to dd-mm-yyyy
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


// Function to format number to Rupiah
function formatRupiah(angka) {
    let number = typeof angka === "number" ? angka : parseFloat(angka);
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Function to generate PDF with borders
// Function to generate PDF with borders
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    // Title
    doc.setFontSize(20);
    doc.text("Laporan Data Booking Salon CARE", doc.internal.pageSize.width / 2, 15, { align: "center" });

    let currentY = 30; 


    // Tampilkan rentang tanggal jika ada filter, dan posisikan di tengah
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let paymentStatus = $('#paymentStatus').val(); // Ambil status pembayaran
    // Ambil nilai total booking dan completed booking
    let totalBookings = $('#totalBookings').text(); 
    let completedBookings = $('#completedBookings').text(); 
    let totalRevenue = $('#totalRevenue').text(); 

    if (startDate && endDate) {
        doc.setFontSize(12);
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        const dateRange = `Tanggal: ${formattedStartDate} - ${formattedEndDate}`;
        doc.text(dateRange, doc.internal.pageSize.width / 2, 30, { align: "center" });
    }
    

     // Tambahkan informasi Status Pembayaran jika ada
     if (paymentStatus) {
        const paymentText = `Status Pembayaran: ${paymentStatus}`;
        doc.text(paymentText, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // currentY += 10;
    }

    // Tambahkan Total Booking dan Completed Booking di bawah Status Pembayaran
    doc.setFontSize(12);
    doc.text(totalBookings, doc.internal.pageSize.width / 2, 40, { align: "center" });
    // currentY += 10;
    doc.text(completedBookings, doc.internal.pageSize.width / 2, 45, { align: "center" });
    // currentY += 15;
    doc.text(totalRevenue, doc.internal.pageSize.width / 15, 45, { align: "left" });

  

    // Ambil data dari tabel HTML
    let tableData = [];
    $('#bookingData tr').each(function () {
        let rowData = [];
        $(this).find('td').each(function () {
            rowData.push($(this).text());
        });
        tableData.push(rowData);
    });

    // AutoTable configuration
    doc.autoTable({
        head: [["No", "Customer Name", "Phone", "Email", "Booking Date", "Total Price", "Selected Services", "Payment Status"]],
        body: tableData,
        startY: 50, // Mulai setelah judul
        theme: 'grid', // Tabel dengan border grid
        styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: 'center', // Teks rata tengah
        },
        headStyles: {
            fillColor: [255, 119, 140], // Warna header (biru)
            textColor: 255, // Warna teks putih
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240], // Warna latar untuk baris selang-seling
        }
    });

    // Simpan PDF
    doc.save('laporan-booking.pdf');
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
