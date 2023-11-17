var map = L.map('map').setView([46.8182, 8.2275], 7); // Switzerland's coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON for Swiss cantons here and add event listeners for clicks
