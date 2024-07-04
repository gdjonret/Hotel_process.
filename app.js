const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Index page route
app.get("/", (req, res) => {
    res.render("index");
});

// BookNow page route
app.get("/BookNow", async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/api/bookings'); // Adjust the URL to your Spring Boot endpoint
        const bookings = response.data;
        res.render("pages/BookNow", { bookings });
    } catch (error) {
        console.error('There was an error!', error);
        res.status(500).send('Server Error');
    }
});

// Signin page route
app.get("/Signin", (req, res) => {
    res.render("pages/Signin");
});

// Admin page route
app.get("/Admin", async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/api/admin'); // Adjust the URL to your Spring Boot endpoint
        const adminData = response.data;
        res.render("pages/Admin", { adminData });
    } catch (error) {
        console.error('There was an error!', error);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
