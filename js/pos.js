// Function to update the total price based on selected services
function updateTotal() {
    let total = 0;
    const services = document.querySelectorAll('.service-item input[type="checkbox"]');

    services.forEach(service => {
        if (service.checked) {
            total += parseFloat(service.dataset.price);
        }
    });

    // Update the total price on the page
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// Function to handle checkout action
function checkout() {
    const total = document.getElementById('totalPrice').textContent;
    if (parseFloat(total) > 0) {
        alert(`Checkout successful! Total amount: $${total}`);
        // Here you can add logic to process payment, save order, etc.
        // Reset form after checkout
        document.querySelectorAll('.service-item input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        updateTotal(); // Reset total price to 0
    } else {
        alert("Please select at least one service.");
    }
}

// Add event listeners to checkboxes for updating the total
document.querySelectorAll('.service-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateTotal);
});

// Initialize total price on page load
updateTotal();
