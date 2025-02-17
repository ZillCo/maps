document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map and set the default view
    const map = L.map("map").setView([14.5995, 120.9842], 12); // Default: Manila

    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker;

    // Function to search for a location
    window.searchLocation = async function () {
        const searchBox = document.getElementById("searchBox").value.trim();
        const status = document.getElementById("status");

        if (!searchBox) {
            status.textContent = "⚠️ Please enter a location!";
            return;
        }

        try {
            status.textContent = "🔍 Searching...";
            const response = await fetch(`http://localhost:5000/geocode?address=${encodeURIComponent(searchBox)}`);
            const data = await response.json();

            if (data.error) {
                status.textContent = "❌ Location not found!";
                return;
            }

            // Update the map
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);
            status.textContent = `📍 Found: ${data.display_name}`;

            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lon]).addTo(map).bindPopup(`<b>${data.display_name}</b>`).openPopup();
            map.setView([lat, lon], 12);
        } catch (error) {
            status.textContent = "⚠️ Error fetching location!";
            console.error("Error:", error);
        }
    };
});
