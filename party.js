document.addEventListener("DOMContentLoaded", () => {
    const eventsList = document.getElementById("events-list");
    const eventForm = document.getElementById("event-form");
    const url="https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-ftb-mt-web-pt/events";
    
    // Fetch and display all parties
    function fetchEvents() {
        fetch(url)
            .then(response => response.json())
            .then(events => {
                console.log("events", events);
                eventsList.innerHTML = "";
                events.data.forEach( renderEvent);
            })
            .catch(error => console.error("events.json", error));
    }
    // Fetch events 
    fetchEvents(url);
    
    // Render a single event
    function renderEvent(event) {
        console.log("Rendering event:", event);
        if (!event.id) {
            console.error("Event ID is missing when rendering event:", event);
            return;
        }

        const eventItem = document.createElement("li");
        eventItem.innerHTML = `
            <strong>${event.name}</strong> - ${event.date} at ${event.time} <br>
            Location: ${event.location} <br>
            Description: ${event.description} <br>
            <button class="delete-btn" data-id="${event.id}">Delete</button>
        `;
        eventsList.appendChild(eventItem);

        // Attach the delete event to the delete button
        eventItem.querySelector(".delete-btn").addEventListener("click", () => deleteEvent(event.id));
    }
    
    // Add new event
    eventForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newEvent = {
            name: formData.get("name"),
            date: formData.get("date"),
            time: formData.get("time"),
            location: formData.get("location"),
            description: formData.get("description"),
            id: generateEventId() // Generate a unique ID for the new event
        };

        // Render the newly added event with a delete button
        renderEvent(newEvent);
        
        event.target.reset();  // Reset form fields after adding event
    });
    
    // Delete event
    function deleteEvent(id) {
        if (!id) {
            console.error("Event ID is missing!");
            return;
        }
        
        fetch(`${url}/${id}`, {
            method: "DELETE"
        })
        .then(() => fetchEvents())  // Refetch events after deletion
        .catch(error => console.error("Error deleting event:", error));
    }

    // Function to generate a new unique ID (for local usage)
    function generateEventId() {
        return 'event-' + Date.now();
    }
    
    // Initial fetch of events
    fetch(url);
});