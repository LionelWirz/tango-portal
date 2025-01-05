import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('https://tangoportal.pockethost.io/');

// you can also fetch all records at once via getFullList
const records = await pb.collection('events').getFullList({
    sort: '-someField',
});




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




