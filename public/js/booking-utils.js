// Common utility functions for booking process

// Load and display booking summary
function loadBookingSummary() {
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');
    
    // Update summary with booking details
    document.getElementById('roomType').textContent = bookingDetails.roomType || 'N/A';
    document.getElementById('checkInDate').textContent = formatDate(bookingDetails.checkIn) || 'N/A';
    document.getElementById('checkOutDate').textContent = formatDate(bookingDetails.checkOut) || 'N/A';
    
    // Calculate number of nights
    const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
    document.getElementById('numberOfNights').textContent = nights ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'N/A';
    
    // Format guests
    const guests = bookingDetails.guests;
    document.getElementById('numberOfGuests').textContent = guests ? `${guests} ${guests === '1' ? 'guest' : 'guests'}` : 'N/A';
    
    // Calculate and display total amount
    const price = parseFloat(bookingDetails.price || 0);
    const total = price * (nights || 0);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

// Format date ensuring timezone doesn't affect the date
function formatDate(dateStr) {
    if (!dateStr) return null;
    // Split the date string and create a new date using components
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    // Create date using UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month - 1, day));
    
    return new Intl.DateTimeFormat('en-US', { 
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'  // Ensure we use UTC for consistent date display
    }).format(date);
}

// Calculate nights between two dates
function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    
    // Parse dates using UTC to avoid timezone issues
    const [checkInYear, checkInMonth, checkInDay] = checkIn.split('-').map(num => parseInt(num, 10));
    const [checkOutYear, checkOutMonth, checkOutDay] = checkOut.split('-').map(num => parseInt(num, 10));
    
    const firstDate = Date.UTC(checkInYear, checkInMonth - 1, checkInDay);
    const secondDate = Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay);
    
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((secondDate - firstDate) / oneDay));
}

// Save guest details to localStorage
function saveGuestDetails(formData) {
    localStorage.setItem('guestDetails', JSON.stringify(formData));
}

// Load guest details from localStorage
function loadGuestDetails() {
    return JSON.parse(localStorage.getItem('guestDetails') || '{}');
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Validate required fields
function validateRequiredFields(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Format card number (remove non-digits)
function formatCardNumber(input) {
    input.value = input.value.replace(/\D/g, '');
}

// Format expiry date (MM/YY)
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2);
    }
    input.value = value;
}
