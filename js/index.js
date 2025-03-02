document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8000/index.php/stats")
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalBookings").textContent = data.total_bookings || 0;
            document.getElementById("remainingSlots").textContent = data.remaining_slots || 0;
        })
        .catch(error => {
            console.error("Error fetching booking stats:", error);
            document.getElementById("totalBookings").textContent = "Error loading data";
            document.getElementById("remainingSlots").textContent = "Error loading data";
        });
});
