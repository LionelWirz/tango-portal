import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('https://tangoportal.pockethost.io/');

// Fetch events and initialize rendering
async function fetchEvents() {
    try {
        const records = await pb.collection('events').getFullList({
            sort: '-someField',
        });
        renderCalendar(records); // Render events
        return records; // Return the fetched events
    } catch (error) {
        console.error('Error fetching events:', error);
        alert('Failed to load events. Please try again later.');
    }
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

// Show event details (Optional function)
function showEventDetails(event) {
    const details = document.getElementById('details');
    details.style.display = 'block';
    details.innerHTML = `
        <h2>${event.name}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <button onclick="hideDetails()">Close</button>
    `;
}

// Hide details (Optional function)
function hideDetails() {
    const details = document.getElementById('details');
    details.style.display = 'none';
}

// Filter events by date
document.getElementById('date-picker').addEventListener('change', async function () {
    const selectedDate = this.value;
    const events = await fetchEvents(); // Fetch all events
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === selectedDate;
    });

    if (filteredEvents.length === 0) {
        alert('No events found for the selected date.');
    } else {
        renderCalendar(filteredEvents); // Render filtered events
    }
});

// Initial render
(async function initialize() {
    const records = await fetchEvents();
    renderCalendar(records); // Render the initial events
})();
