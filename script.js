// Initialize PocketBase client
const pb = new PocketBase('https://tangoportal.pockethost.io/');

// Initialize the map
const map = L.map('map').setView([46.8182, 8.2275], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch events from PocketBase and initialize rendering
async function fetchEvents() {
    try {
        const events = await pb.collection('events').getFullList(); // Fetch all events
        renderCalendar(events); // Populate calendar
        displayEventsOnMap(events); // Display markers on the map
        return events; // Return events for potential filtering
    } catch (error) {
        console.error('Error fetching events:', error);
        alert("Failed to load events. Please try again later.");
    }
}

// Render events on the map
function displayEventsOnMap(events) {
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add markers for each event
    events.forEach(event => {
        const coords = event.coords.split(',').map(Number);
        L.marker(coords)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`);
    });
}

// Render events in the calendar
function renderCalendar(events) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear existing events

    events.forEach(event => {
        const entry = document.createElement('div');
        entry.className = 'calendar-entry';
        entry.innerHTML = `
            <strong>${event.name}</strong><br>
            Date: ${event.date}<br>
            Description: ${event.description}
        `;
        entry.onclick = () => showEventDetails(event); // Add click handler
        calendar.appendChild(entry);
    });
}


// Show event details
function showEventDetails(event) {
    const details = document.getElementById('details');
    details.innerHTML = `
        <h2>${event.name}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Coordinates:</strong> ${event.coords}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <button onclick="goBack()">Back</button>
    `;
    document.getElementById('calendar').style.display = 'none';
    details.style.display = 'block';
}

// Back button functionality
function goBack() {
    document.getElementById('details').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
}

// Submit new event
document.getElementById('event-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value.trim();
    const coords = document.getElementById('event-coords').value.trim();
    const description = document.getElementById('event-description').value.trim();

    // Validate input
    if (!name || !date || !coords) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        // Create a new event in PocketBase
        await pb.collection('events').create({ name, date, coords, description });
        alert("Event added successfully!");
        fetchEvents(); // Refresh events
        this.reset(); // Reset form
    } catch (error) {
        console.error('Error saving event:', error);
        alert("Failed to add event. Please try again.");
    }
});

// Filter events by date
document.getElementById('date-picker').addEventListener('change', async function () {
    const selectedDate = this.value;
    const events = await fetchEvents(); // Get all events
    const filteredEvents = events.filter(event => event.date === selectedDate);

    if (filteredEvents.length === 0) {
        alert("No events found for the selected date.");
    } else {
        renderCalendar(filteredEvents); // Render filtered events in calendar
        displayEventsOnMap(filteredEvents); // Display filtered events on map
    }
});

// Initial render
fetchEvents();




