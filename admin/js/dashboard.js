document.addEventListener('DOMContentLoaded', function() {
  // Array of endpoint URLs and their corresponding element IDs
  const endpoints = [
    { url: 'http://localhost:8000/index.php/customer', elementId: 'totalUsers' },
    { url: 'http://localhost:8000/index.php/service', elementId: 'totalServices' },
    { url: 'http://localhost:8000/index.php/booking', elementId: 'totalBookings' }
  ];

  // Function to fetch data and update the count
  function fetchDataAndUpdateCount(url, elementId) {
    fetch(url)
      .then(response => response.json()) // Assuming the response is JSON
      .then(data => {
        console.log('Response data from', url, ':', data); // Log the response for debugging

        let count = 0;
        
        // If the endpoint is for customers, filter by role 'customer'
        if (url.includes('customer')) {
          // Filter customers by role 'customer'
          count = data.filter(customer => customer.role === 'customer').length;
        } else {
          // For other data (like services and bookings), just count the items
          count = Array.isArray(data) ? data.length : 0;
        }

        // Update the element with the count of items
        document.getElementById(elementId).innerText = count;
      })
      .catch(error => {
        console.error('Error fetching data from', url, ':', error);
        document.getElementById(elementId).innerText = 'Error';
      });
  }

  // Function to fetch most ordered services and display the pie chart
  function fetchMostOrderedServices() {
    fetch('http://localhost:8000/index.php/most-ordered-services')
      .then(response => response.json())
      .then(data => {
        console.log('Most ordered services:', data); // Log the response for debugging

        // If no services are found, skip chart creation
        if (data.message || data.length === 0) {
          return;
        }

        const labels = data.map(service => service.nama_service);
        const values = data.map(service => service.total_ordered);

        // Create a pie chart for most ordered services
        const ctx = document.getElementById('mostOrderedServicesChart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'pie',  // Change chart type to 'pie'
          data: {
            labels: labels,  // Labels for each service
            datasets: [{
              label: 'Most Ordered Services',
              data: values,  // Data for the number of orders
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return tooltipItem.label + ': ' + tooltipItem.raw;
                  }
                }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('Error fetching most ordered services:', error);
      });
  }

  // Fetch total users, services, and bookings
  endpoints.forEach(endpoint => {
    fetchDataAndUpdateCount(endpoint.url, endpoint.elementId);
  });

  // Fetch most ordered services and display the pie chart
  fetchMostOrderedServices();
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
