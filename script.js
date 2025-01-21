import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('https://tango-test.pockethost.io/');

// Fetch events and render them
async function fetchEvents() {
    try {
        const records = await pb.collection('events').getFullList({
            sort: 'date',
        });
        renderCalendar(records);
    } catch (error) {
        console.error('Error fetching events:', error);
        alert('Failed to load events. Please try again later.');
    }
}

// Render events in the calendar
function renderCalendar(events) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    if (events.length === 0) {
        calendar.innerHTML = '<p>No events found.</p>';
        return;
    }

    events.forEach(event => {
        const entry = document.createElement('div');
        entry.className = 'calendar-entry';
        entry.innerHTML = `
            <strong>${event.name}</strong><br>
            Date: ${event.date}<br>
            Description: ${event.description}
        `;
        entry.onclick = () => showEventDetails(event);
        calendar.appendChild(entry);
    });
}

// Show event details in a popup or separate section
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

// Hide event details
function hideDetails() {
    const details = document.getElementById('details');
    details.style.display = 'none';
}

// Filter events by date
document.getElementById('date-picker').addEventListener('change', async function () {
    const selectedDate = this.value;
    try {
        const events = await pb.collection('events').getFullList({
            filter: `date = "${selectedDate}"`,
        });

        if (events.length === 0) {
            alert('No events found for the selected date.');
        } else {
            renderCalendar(events);
        }
    } catch (error) {
        console.error('Error filtering events:', error);
    }
});

// Initialize app
(async function initialize() {
    await fetchEvents();
})();
