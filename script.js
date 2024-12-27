// Initialize the map
const map = L.map('map').setView([46.8182, 8.2275], 7); // Switzerland center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Events from localStorage or default
let localEvents = JSON.parse(localStorage.getItem('tangoEvents')) || [
    { id: 1, name: "Zurich Tango Night", coords: [47.3769, 8.5417], date: "2024-06-20" },
    { id: 2, name: "Geneva Tango Festival", coords: [46.2044, 6.1432], date: "2024-07-05" }
];

async function fetchEvents() {
    try {
        const records = await pb.collection('events').getFullList(); // Fetch all events
        const events = records.map(record => ({
            id: record.id,
            name: record.name,
            coords: record.coords.split(',').map(Number),
            date: record.date,
            description: record.description
        }));
        updateCalendarAndMap(events);
    } catch (error) {
        console.error('Error fetching events from Pockethost:', error);
        alert("Failed to load events. Please try again later.");
    }
}

document.getElementById('event-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const coordsInput = document.getElementById('event-coords').value;

    const coords = coordsInput.split(',').map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        alert("Please enter valid coordinates (e.g., 46.2044, 6.1432).");
        return;
    }

    const newEvent = { name, date, coords: coordsInput, description: "No description provided." };

    try {
        await pb.collection('events').create(newEvent); // Save to Pockethost
        alert("Event added successfully!");
        fetchEvents(); // Refresh events
        this.reset();
    } catch (error) {
        console.error('Error saving event to Pockethost:', error);
        alert("Failed to add event. Please try again.");
    }
});


// Render events on the map
function displayEvents(events) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    events.forEach(event => {
        L.marker(event.coords)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b><br>Date: ${event.date}`);
    });
}

// Render events in the calendar
function renderCalendar(events) {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear existing entries

    if (events.length === 0) {
        calendarContainer.innerHTML = `<p>No events available.</p>`;
        return;
    }

    events.forEach(event => {
        const entryElement = document.createElement('div');
        entryElement.classList.add('calendar-entry');
        entryElement.innerHTML = `
            <span>${event.date}:</span> <strong>${event.name}</strong>
        `;
        entryElement.onclick = () => showEventDetails(event); // Pass event data
        calendarContainer.appendChild(entryElement);
    });
}

// Show event details
function showEventDetails(event) {
    const detailsContainer = document.getElementById('details');
    detailsContainer.innerHTML = `
        <h2>${event.name}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.coords.join(', ')}</p>
        <button onclick="goBack()">Back</button>
    `;
    document.getElementById('calendar').style.display = 'none';
    detailsContainer.style.display = 'block';
}

function goBack() {
    document.getElementById('details').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
}

// Update the calendar and map
function updateCalendarAndMap() {
    const combinedEvents = [...localEvents, ...apiEvents];
    console.log("Combined Events:", combinedEvents); // Debugging log
    renderCalendar(combinedEvents);
    displayEvents(combinedEvents);
}

// Event Form Submission
document.getElementById('event-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const coordsInput = document.getElementById('event-coords').value;

    const coords = coordsInput.split(',').map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        alert("Please enter valid coordinates (e.g., 46.2044, 6.1432).");
        return;
    }

    const newEvent = { id: Date.now(), name, coords, date };
    localEvents.push(newEvent);
    localStorage.setItem('tangoEvents', JSON.stringify(localEvents));
    updateCalendarAndMap();
    this.reset();
    alert("Event added successfully!");
});

// Filter events by date
document.getElementById('date-picker').addEventListener('change', function () {
    const selectedDate = this.value;
    const filteredEvents = [...localEvents, ...apiEvents].filter(event => event.date === selectedDate);

    if (filteredEvents.length === 0) {
        alert("No events found for the selected date.");
    }

    renderCalendar(filteredEvents);
    displayEvents(filteredEvents);
});

const pb = new PocketBase('https://tangoportal.pockethost.io/'); // Replace with your Pockethost URL

// Initial render
fetchEvents();
updateCalendarAndMap();


