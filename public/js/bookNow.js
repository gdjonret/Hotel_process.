// Initialize date pickers when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get today's date in YYYY-MM-DD format without time component
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');

    // Get stored values from session storage
    const storedCheckin = sessionStorage.getItem('checkin');
    const storedCheckout = sessionStorage.getItem('checkout');
    const storedGuests = sessionStorage.getItem('guests');

    // Initialize date pickers
    const checkinPicker = flatpickr("#checkin", {
        minDate: todayStr,
        dateFormat: "Y-m-d",
        altFormat: "Y-m-d",
        altInput: true,
        altInputClass: "form-control",
        defaultDate: storedCheckin ? storedCheckin : null,
        onChange: function(selectedDates, dateStr) {
            // Update checkout minDate when checkin date changes
            if (selectedDates[0]) {
                const formattedDate = selectedDates[0].toISOString().split('T')[0];
                document.querySelector("#checkout")._flatpickr.set("minDate", formattedDate);
            }
        }
    });

    const checkoutPicker = flatpickr("#checkout", {
        minDate: storedCheckin || todayStr,
        dateFormat: "Y-m-d",
        altFormat: "Y-m-d",
        altInput: true,
        altInputClass: "form-control",
        defaultDate: storedCheckout ? storedCheckout : null
    });

    // Set the number of guests if it exists
    if (storedGuests) {
        document.getElementById('adults').value = storedGuests;
    }

    // Handle search form submission
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateFields()) {
            showMessage('Rooms are available!', 'success');
        }
    });

    // Handle Book Now button clicks
    const bookNowButtons = document.querySelectorAll(".book-now-btn");
    bookNowButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            const roomDetails = button.closest('.room-details');
            const roomType = roomDetails.querySelector('h2').textContent;
            const price = roomDetails.dataset.price;
            validateAndBook(roomType, price);
        });
    });
});

// Function to validate required fields
function validateFields() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const adults = document.getElementById('adults').value;

    if (!checkin || !checkout || !adults) {
        showMessage('Please fill in all required fields', 'danger');
        return false;
    }

    // Validate that checkout is after checkin
    const [checkInYear, checkInMonth, checkInDay] = checkin.split('-').map(num => parseInt(num, 10));
    const [checkOutYear, checkOutMonth, checkOutDay] = checkout.split('-').map(num => parseInt(num, 10));
    
    const checkinDate = Date.UTC(checkInYear, checkInMonth - 1, checkInDay);
    const checkoutDate = Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay);
    
    if (checkoutDate <= checkinDate) {
        showMessage('Check-out date must be after check-in date', 'danger');
        return false;
    }

    return true;
}

// Function to show messages
function showMessage(message, type) {
    const warning = document.getElementById('booking-warning');
    warning.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    warning.className = `alert alert-${type}`;
    warning.style.display = 'block';
    
    setTimeout(() => {
        warning.style.display = 'none';
    }, 3000);
}

// Function to handle booking
async function validateAndBook(roomType, price) {
    if (!validateBooking()) {
        return;
    }

    const bookingData = {
        roomNumber: roomType,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        guestName: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        guestPhone: document.getElementById('guestPhone').value,
        totalPrice: price,
        specialRequests: document.getElementById('specialRequests')?.value || '',
        status: 'PENDING'
    };

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const result = await response.json();
            showMessage('Booking successful!', 'success');
            // Reset form or redirect as needed
            setTimeout(() => {
                window.location.href = '/'; // Redirect to home page after successful booking
            }, 2000);
        } else {
            const error = await response.json();
            showMessage('Booking failed: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred while creating the booking. Please try again.', 'error');
    }
}

// Function to sort rooms
function sortRooms(criteria, order) {
    const roomsContainer = document.querySelector('.col-md-8');
    const rooms = Array.from(roomsContainer.querySelectorAll('.room-container'));

    rooms.sort((a, b) => {
        let valueA, valueB;

        if (criteria === 'price') {
            valueA = parseFloat(a.querySelector('.room-details').dataset.price);
            valueB = parseFloat(b.querySelector('.room-details').dataset.price);
        }

        if (order === 'asc') {
            return valueA - valueB;
        } else {
            return valueB - valueA;
        }
    });

    // Remove existing rooms
    rooms.forEach(room => room.remove());

    // Append sorted rooms
    rooms.forEach(room => roomsContainer.appendChild(room));
}

document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    const adults = document.getElementById("adults");
    const bookNowButtons = document.querySelectorAll(".book-now-btn");
    const warningMessage = document.getElementById("booking-warning");

    function validateBooking() {
        if (!checkin.value || !checkout.value || !adults.value) {
            warningMessage.style.display = "block";
            
            // Scroll to the warning message
            warningMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide warning after 3 seconds
            setTimeout(() => {
                warningMessage.style.display = "none";
            }, 3000);
            
            return false;
        }
        return true;
    }

    // Handle search form submission
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateBooking()) {
            // Show success message
            warningMessage.className = "alert alert-success";
            warningMessage.innerHTML = '<i class="fas fa-check-circle"></i> Rooms available for your dates!';
            warningMessage.style.display = "block";
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                warningMessage.style.display = "none";
                // Reset class for future warnings
                warningMessage.className = "alert alert-danger";
            }, 3000);
        }
    });

    // Handle "BOOK NOW" button clicks
    bookNowButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            if (validateBooking()) {
                // Get room details
                const roomDetails = button.closest('.room-details');
                const roomType = roomDetails.querySelector('h2').textContent;
                const price = roomDetails.dataset.price;
                
                // Save booking details to localStorage
                const bookingDetails = {
                    roomType: roomType,
                    checkIn: document.getElementById('checkin').value,
                    checkOut: document.getElementById('checkout').value,
                    guests: document.getElementById('adults').value,
                    price: price
                };
                
                localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
                
                // Redirect to guest details page
                window.location.href = "/GuestDetails";
            }
        });
    });

    // Initialize check-in date picker
    const checkinPicker = flatpickr("#checkin", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disableMobile: "true",
        animate: true,
        theme: "material_green",
        onChange: function(selectedDates) {
            if (selectedDates[0]) {
                // Update checkout min date
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkoutPicker.set('minDate', nextDay);
                
                // Clear checkout if it's before or equal to checkin
                const checkoutDate = checkoutPicker.selectedDates[0];
                if (checkoutDate && checkoutDate <= selectedDates[0]) {
                    checkoutPicker.clear();
                }
            }
        }
    });

    // Initialize check-out date picker
    const checkoutPicker = flatpickr("#checkout", {
        dateFormat: "Y-m-d",
        minDate: new Date().fp_incr(1), // Tomorrow
        disableMobile: "true",
        animate: true,
        theme: "material_green"
    });
});
