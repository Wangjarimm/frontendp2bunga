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
  
    // Iterate over each endpoint and fetch data
    endpoints.forEach(endpoint => {
      fetchDataAndUpdateCount(endpoint.url, endpoint.elementId);
    });
});
