const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS to allow frontend to call this backend
app.use(cors());

// API route to fetch location coordinates
app.get("/geocode", async (req, res) => {
    try {
        const address = req.query.address;
        if (!address) {
            return res.status(400).json({ error: "Address parameter is required" });
        }

        // OpenStreetMap Nominatim API
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

        const response = await axios.get(url);
        if (response.data.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        const location = response.data[0];
        res.json({
            lat: location.lat,
            lon: location.lon,
            display_name: location.display_name
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
