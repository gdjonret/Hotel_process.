const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = 'http://localhost:8080/api';

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Index page route
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/BookNow", (req, res) => {
    res.render("pages/BookNow");
});

// API endpoint to create a booking
app.post("/api/bookings", async (req, res) => {
    try {
        const bookingData = {
            roomNumber: req.body.roomNumber,
            checkInDate: req.body.checkin,
            checkOutDate: req.body.checkout,
            guestName: req.body.guestName,
            guestEmail: req.body.guestEmail,
            guestPhone: req.body.guestPhone,
            totalPrice: req.body.totalPrice,
            specialRequests: req.body.specialRequests,
            status: 'PENDING'
        };

        const response = await axios.post(`${BACKEND_URL}/bookings`, bookingData);
        res.json(response.data);
    } catch (error) {
        console.error('Error creating booking:', error.message);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// API endpoint to get all bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/bookings`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Signin page route
app.get("/Signin", (req, res) => {
    res.render("pages/Signin");
});

// Discover Chad page route
app.get("/discover-chad", (req, res) => {
    res.render("pages/discover-chad");
});

app.get("/Admin", (req, res) => {
    res.render("pages/Admin");
});

app.get("/GuestDetails", (req, res) => { 
    res.render("pages/GuestDetails");
});

app.get("/Checkout", (req, res) => { 
    res.render("pages/Checkout");
});

// Confirmation page
app.get('/confirmation', (req, res) => {
    res.render('pages/confirmation');
});

app.get("/staff", async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/api/employees'); // Adjust the URL to your Spring Boot endpoint
        const employees = response.data;
        res.render('pages/staff', { employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Server Error');
    }
});

app.post("/book-room", (req, res) => {
    const { arrivalDate, departureDate, adults } = req.body;
    
    // Store the booking data (you can expand this later)
    const bookingData = {
        arrivalDate,
        departureDate,
        adults
    };
    
    // Redirect to guest details page with query parameters
    res.redirect(`/GuestDetails?arrival=${arrivalDate}&departure=${departureDate}&adults=${adults}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
