// Initialize the map with Leaflet
var map = L.map('map').setView([46.8182, 8.2275], 7); // Switzerland's center coordinates

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example Markers for Events
var events = [
    { name: "Zurich Tango Night", coords: [47.3769, 8.5417], date: "2024-06-20" },
    { name: "Geneva Tango Festival", coords: [46.2044, 6.1432], date: "2024-07-05" },
    { name: "Bern Tango Workshop", coords: [46.9481, 7.4474], date: "2024-06-25" }
];

// Add markers to the map
events.forEach(event => {
    L.marker(event.coords)
        .addTo(map)
        .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`)
        .openPopup();
});

// Filter Events Based on Date Picker
document.getElementById('date-picker').addEventListener('change', function () {
    const selectedDate = this.value;

    // Clear the map
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Re-add markers matching the selected date
    events.filter(event => event.date === selectedDate).forEach(event => {
        L.marker(event.coords)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`)
            .openPopup();
    });

    if (!events.some(event => event.date === selectedDate)) {
        alert("No events found for the selected date.");
    }
});
