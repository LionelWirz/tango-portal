// Initialize the map with Switzerland locked
var map = L.map('map', {
    center: [46.8182, 8.2275],
    zoom: 7,
    maxZoom: 12,
    minZoom: 6,
    maxBounds: [
        [45.3982, 5.1402], // Southwest corner
        [48.2301, 10.4921] // Northeast corner
    ],
    maxBoundsViscosity: 1.0
});

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


// Load events from localStorage or use default
var events = JSON.parse(localStorage.getItem('tangoEvents')) || [
    { name: "Zurich Tango Night", coords: [47.3769, 8.5417], date: "2024-06-20" },
    { name: "Geneva Tango Festival", coords: [46.2044, 6.1432], date: "2024-07-05" }
];

// Function to display events on the map
function displayEvents() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    events.forEach(event => {
        L.marker(event.coords)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`)
            .openPopup();
    });
}

// Initial display of events
displayEvents();

// Event Form Submission
document.getElementById('event-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const coordsInput = document.getElementById('event-coords').value;

    // Validate and parse coordinates
    const coords = coordsInput.split(',').map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        alert("Please enter valid coordinates (e.g., 46.2044, 6.1432).");
        return;
    }

    // Add new event
    const newEvent = { name, coords, date };
    events.push(newEvent);

    // Save to localStorage
    localStorage.setItem('tangoEvents', JSON.stringify(events));

    // Update the map
    displayEvents();

    // Clear the form
    this.reset();
    alert("Event added successfully!");
});

// Date Picker Filter
document.getElementById('date-picker').addEventListener('change', function () {
    const selectedDate = this.value;

    // Filter events
    const filteredEvents = events.filter(event => event.date === selectedDate);

    // Update map with filtered events
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (filteredEvents.length === 0) {
        alert("No events found for the selected date.");
    }

    filteredEvents.forEach(event => {
        L.marker(event.coords)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`)
            .openPopup();
    });
});
