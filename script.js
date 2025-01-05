// Initialize PocketBase client
const pb = new PocketBase('https://tangoportal.pockethost.io/');



// Fetch events from PocketBase and initialize rendering
async function fetchEvents() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '<p>Loading events...</p>'; // Temporary loading message

    try {
        const records = await pb.collection('events').getFullList({
            sort: '-someField',
        });
        renderCalendar(records);
        displayEventsOnMap(records);
        return records;
    } catch (error) {
        console.error('Error fetching events:', error);
        alert("Failed to load events. Please try again later.");
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
// Filter events by date
document.getElementById('date-picker').addEventListener('change', async function () {
    const selectedDate = this.value;
    const events = await fetchEvents(); // Get all events
    const filteredEvents = events.filter(event => event.date === selectedDate);

    if (filteredEvents.length === 0) {
        alert("No events found for the selected date.");
    } else {
        renderCalendar(filteredEvents); // Render filtered events in calendar
    }
});

// Initial render
fetchEvents();




