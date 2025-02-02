$(document).ready(function () {
    // Flag untuk memeriksa apakah filter diterapkan
    let isFiltered = false;

    // Ambil elemen input tanggal
    $('#filterButton').on('click', function () {
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();
        if (startDate && endDate) {
            fetchBookingData(startDate, endDate);
            isFiltered = true;  // Tandai bahwa filter diterapkan
        } else {
            alert('Please select both start date and end date.');
        }
    });

    // Fetch data booking
    function fetchBookingData(startDate = '', endDate = '') {
        let url = 'http://localhost:8000/index.php/booking'; // API untuk mengambil semua booking
        if (startDate && endDate) {
            url = `http://localhost:8000/index.php/range?start_date=${startDate}&end_date=${endDate}`; // API untuk filter berdasarkan rentang tanggal
        }

        console.log('Requesting URL:', url);  // Debug log
    
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                let bookings;
                try {
                    bookings = JSON.parse(response); // Parse response JSON
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    alert('Invalid API response format.');
                    return;
                }
    
                let bookingTable = $('#bookingData');
                bookingTable.empty();
    
                if (Array.isArray(bookings)) { // Pastikan data yang diterima adalah array
                    // Mengurutkan data berdasarkan tanggal booking dari yang paling awal
                    bookings.sort(function (a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });

                    bookings.forEach(function (booking, index) {
                        let servicesList = booking.services ? booking.services.map(service => service.nama_service).join(', ') : 'No services selected';
                        let sequentialId = index + 1;
                        let formattedPrice = formatRupiah(booking.total_price);
    
                        let row = `<tr>
                                    <td>${sequentialId}</td>
                                    <td>${booking.name}</td>
                                    <td>${booking.phone}</td>
                                    <td>${booking.email}</td>
                                    <td>${booking.date}</td>
                                    <td>${formattedPrice}</td>
                                    <td>${servicesList}</td>
                                    <td>${booking.payment_status}</td>
                                </tr>`;
                        bookingTable.append(row);
                    });

                    $('#generatePDFButton').prop('disabled', false);

                    // Tampilkan notifikasi hanya jika data difilter
                    if (isFiltered) {
                        Swal.fire({
                            title: 'Data berhasil difilter!',
                            text: `Dari ${startDate} hingga ${endDate}`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        isFiltered = false;  // Reset flag setelah alert ditampilkan
                    }
                } else {
                    alert('Data not found or invalid response format.');
                }
            },
            error: function () {
                alert('Failed to fetch booking data.');
            }
        });
    }
    
    fetchBookingData(); // Initial fetch without date filter

    // Event listener for generating PDF
    $('#generatePDFButton').on('click', function () {
        generatePDF();
    });
});

// Function to format number to Rupiah
function formatRupiah(angka) {
    let number = typeof angka === "number" ? angka : parseFloat(angka);
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Function to generate PDF with borders
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Set landscape orientation

    // Title of the document (centered)
    doc.setFontSize(20);
    const title = "Salon CARE";
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor; // Calculate text width
    const pageWidth = doc.internal.pageSize.width; // Get the width of the page
    const titleX = (pageWidth - titleWidth) / 2; // Center the title
    doc.text(title, titleX, 20);  // Judul Salon CARE (judul utama)

    // Judul laporan data booking
    doc.setFontSize(16);
    const reportTitle = "Laporan Data Booking Salon CARE";
    doc.text(reportTitle, 20, 40); // Judul laporan data booking (dapat diletakkan di kiri)

    // Menampilkan rentang tanggal jika difilter
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    if (startDate && endDate) {
        doc.setFontSize(12);
        const dateText = `Tanggal: ${startDate} - ${endDate}`;
        doc.text(dateText, 20, 50); // Rentang Tanggal (diletakkan di kiri bawah judul laporan)
    }

    // Table headers
    const headers = ["No", "Customer Name", "Phone", "Email", "Booking Date", "Total Price", "Selected Services", "Payment Status"];
    const startY = 60;  // Menyesuaikan dengan tinggi header
    let currentY = startY;

    // Set font for table content
    doc.setFontSize(10);

    // Column width adjustment for landscape
    const colWidth = [10, 40, 30, 40, 30, 30, 50, 30]; // Adjusted column widths

    // Write headers to PDF with bold font
    doc.setFont('helvetica', 'bold');
    let headerX = 20;
    headers.forEach((header, index) => {
        doc.text(header, headerX, currentY);
        // Draw border for header
        doc.rect(headerX - 3, currentY - 6, colWidth[index] + 1.5, 10); // Adding border for each header cell
        headerX += colWidth[index]; // Move X position for the next header
    });

    currentY += 10;

    // Set normal font for content
    doc.setFont('helvetica', 'normal');

    // Write table rows
    $('#bookingData tr').each(function (index, row) {
        let rowY = currentY;
        $(row).find('td').each(function (colIndex, cell) {
            const cellText = $(cell).text();
            doc.text(cellText, 20 + colWidth.slice(0, colIndex).reduce((a, b) => a + b, 0), rowY);
        });
        currentY += 10;
    });

    // Draw borders around the table
    const tableStartX = 18;
    const tableStartY = startY + 5;
    const rowHeight = 10;
    const numRows = $('#bookingData tr').length;
    const tableWidth = colWidth.reduce((a, b) => a + b, 0);

    doc.rect(tableStartX, tableStartY, tableWidth, rowHeight * (numRows + 1)); // Border for entire table

    let xOffset = tableStartX;
    colWidth.forEach((width) => {
        doc.rect(xOffset, tableStartY, width, rowHeight * (numRows + 1)); // Column borders
        xOffset += width;
    });

    // Save the generated PDF
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
