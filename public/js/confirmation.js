document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load booking details from localStorage
        const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');
        const guestDetails = JSON.parse(localStorage.getItem('guestDetails') || '{}');
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom') || '{}');

        // Generate booking reference
        const bookingRef = 'HLP' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
        document.getElementById('bookingReference').textContent = bookingRef;

        // Calculate nights and total
        const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
        const price = parseFloat(bookingDetails.price || 0);
        const total = price * nights;

        // Update booking summary section
        document.getElementById('roomType').textContent = bookingDetails.roomType || 'Standard Room';
        document.getElementById('checkInDate').textContent = formatDate(bookingDetails.checkIn) || 'N/A';
        document.getElementById('checkOutDate').textContent = formatDate(bookingDetails.checkOut) || 'N/A';
        document.getElementById('numberOfNights').textContent = nights || 'N/A';
        document.getElementById('numberOfGuests').textContent = bookingDetails.guests || '1';
        document.getElementById('totalAmount').textContent = formatCurrency(total);

        // Update confirmation details
        document.getElementById('confirmRoomType').textContent = bookingDetails.roomType || 'Standard Room';
        document.getElementById('roomRate').textContent = price ? `${formatCurrency(price)}/night` : 'N/A';
        document.getElementById('checkIn').textContent = formatDate(bookingDetails.checkIn) || 'N/A';
        document.getElementById('checkOut').textContent = formatDate(bookingDetails.checkOut) || 'N/A';
        
        // Guest Details
        const fullName = `${guestDetails.firstName || ''} ${guestDetails.lastName || ''}`.trim();
        document.getElementById('guestName').textContent = fullName || 'N/A';
        document.getElementById('guestEmail').textContent = guestDetails.email || 'N/A';
        document.getElementById('guestPhone').textContent = guestDetails.phone || 'N/A';
        document.getElementById('confirmTotalAmount').textContent = formatCurrency(total);

        // Prepare booking data for backend
        const bookingData = {
            roomNumber: bookingDetails.roomType,
            checkInDate: bookingDetails.checkIn,
            checkOutDate: bookingDetails.checkOut,
            guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
            guestEmail: guestDetails.email,
            guestPhone: guestDetails.phone,
            totalPrice: total,
            specialRequests: guestDetails.specialRequests || '',
            status: 'CONFIRMED'
        };

        // Send booking to Spring Boot backend
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        const result = await response.json();
        
        // Send email confirmation
        try {
            // Format dates to match LocalDateTime
            const formatToLocalDateTime = (dateStr) => {
                const date = new Date(dateStr);
                return date.toISOString().slice(0, 19); // Format: "2024-02-17T14:00:00"
            };

            const emailResponse = await fetch('http://localhost:8080/api/email/booking-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: result.id,
                    guestEmail: guestDetails.email,
                    guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
                    roomNumber: bookingDetails.roomType,
                    checkInDate: formatToLocalDateTime(bookingDetails.checkIn),
                    checkOutDate: formatToLocalDateTime(bookingDetails.checkOut),
                    totalPrice: total
                })
            });

            if (!emailResponse.ok) {
                const errorText = await emailResponse.text();
                console.error('Warning: Failed to send confirmation email:', errorText);
            }
        } catch (emailError) {
            console.error('Warning: Failed to send confirmation email:', emailError);
        }
        
        // Update confirmation page with booking details
        document.getElementById('bookingReference').textContent = result.id || 'BOOKING-' + Date.now();
        document.getElementById('roomType').textContent = bookingDetails.roomType;
        document.getElementById('confirmRoomType').textContent = bookingDetails.roomType;
        document.getElementById('checkInDate').textContent = formatDate(bookingDetails.checkIn);
        document.getElementById('checkOutDate').textContent = formatDate(bookingDetails.checkOut);
        document.getElementById('checkIn').textContent = formatDate(bookingDetails.checkIn);
        document.getElementById('checkOut').textContent = formatDate(bookingDetails.checkOut);
        document.getElementById('numberOfNights').textContent = nights;
        document.getElementById('numberOfGuests').textContent = bookingDetails.guests;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
        
        // Update guest information
        document.getElementById('guestName').textContent = `${guestDetails.firstName} ${guestDetails.lastName}`;
        document.getElementById('guestEmail').textContent = guestDetails.email;
        document.getElementById('guestPhone').textContent = guestDetails.phone;

        // Clear localStorage after successful booking
        localStorage.removeItem('bookingDetails');
        localStorage.removeItem('guestDetails');
        localStorage.removeItem('selectedRoom');
        localStorage.removeItem('paymentStatus');

    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('There was an error confirming your booking. Please try again or contact support.');
    }
});

// Print confirmation function
function printConfirmation() {
    window.print();
}

// Return to homepage function
function returnToHomepage() {
    // Clear sensitive data
    localStorage.removeItem('guestDetails');
    localStorage.removeItem('selectedRoom');
    localStorage.removeItem('bookingDetails');
    window.location.href = '/';
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to calculate nights
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
