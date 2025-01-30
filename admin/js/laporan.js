$(document).ready(function () {
    // Ambil elemen input tanggal
    $('#filterDate').on('change', function () {
        let selectedDate = $(this).val();
        fetchBookingData(selectedDate);
    });

    // Fetch data booking
    function fetchBookingData(selectedDate = '') {
        $.ajax({
            url: 'http://localhost:8000/index.php/booking', // API endpoint untuk booking
            method: 'GET',
            data: { date: selectedDate },
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

    // Title of the document
    doc.setFontSize(16);
    doc.text("Laporan Data Booking Salon CARE", 20, 20);

    // Table headers
    const headers = ["No", "Customer Name", "Phone", "Email", "Booking Date", "Total Price", "Selected Services", "Payment Status"];
    const startY = 30;
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
