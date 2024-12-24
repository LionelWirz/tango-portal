// Initialize the map
var map = L.map('map').setView([46.8182, 8.2275], 7); // Switzerland center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

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

const API_URL = 'https://script.google.com/macros/s/AKfycbz0sPTZIu2_1O0SRd5kCZja0u64TbIhyygmTTNtoF371wq-3vf9iCFIlSKJxrr6aZU/exec';

async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        const events = await response.json();
        console.log(events); // Log the events for debugging
        renderCalendar(events);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function renderCalendar(events) {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear any existing entries

    events.forEach(event => {
        const entryElement = document.createElement('div');
        entryElement.classList.add('calendar-entry');
        entryElement.innerHTML = `
            <span>${event.date}:</span> <strong>${event.title}</strong>
        `;
        entryElement.onclick = () => showEventDetails(event); // Pass event data
        calendarContainer.appendChild(entryElement);
    });
}

function showEventDetails(event) {
    const detailsContainer = document.getElementById('details');
    detailsContainer.innerHTML = `
        <h2>${event.title}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <button onclick="goBack()">Back</button>
    `;
    document.getElementById('calendar').style.display = 'none';
    detailsContainer.style.display = 'block';
}

function goBack() {
    document.getElementById('details').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
}

fetchEvents(); // Fetch and render events on page load

