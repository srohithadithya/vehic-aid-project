// NOTE: This code relies on the apiClient function from main.js being globally available.

let activeCustomerData = null;

/**
 * Initiates the search for a customer by phone number or IoT Device ID.
 */
function searchCaller() {
    const searchInput = document.getElementById('caller-search').value.trim();
    if (!searchInput) {
        alert("Please enter a Phone Number or IoT Device ID.");
        return;
    }

    // Determine the type of identifier
    const identifierType = searchInput.startsWith('IOT-') ? 'IOT_ID' : 'PHONE';
    
    const payload = {
        identifier: searchInput,
        type: identifierType
    };

    apiClient('users/lookup/', 'POST', payload)
        .then(data => {
            if (data && data.user) {
                activeCustomerData = data.user;
                updateCallerDetails(data.user);
            } else {
                alert(`User not found with ${identifierType}. Proceed as unregistered.`);
                resetCallerDetails();
            }
        })
        .catch(error => {
            console.error("Search API Error:", error);
            alert("Error connecting to user lookup service.");
            resetCallerDetails();
        });
}

/**
 * Updates the UI with the found customer's details.
 */
function updateCallerDetails(user) {
    document.getElementById('user-name').textContent = user.full_name;
    document.getElementById('user-subscription').textContent = user.subscription_plan;
    document.getElementById('user-vehicle').textContent = `${user.primary_vehicle_make} (${user.primary_vehicle_plate})`;
    document.getElementById('user-last-location').textContent = user.last_known_address || 'GPS Unspecified';

    // Update call status to reflect an active user connection
    const statusWidget = document.querySelector('.call-status-widget');
    statusWidget.classList.remove('status-ringing');
    statusWidget.classList.add('status-active-call');
    document.getElementById('call-status-text').textContent = 'USER LOADED';

    // (In a complete project, history would be loaded via an API call here)
}

/**
 * Submits the manually created service ticket to the backend.
 */
function dispatchManualRequest() {
    if (!activeCustomerData) {
        alert("Cannot dispatch: User data is not loaded.");
        return;
    }
    
    const issue = document.getElementById('issue').value;
    const location = document.getElementById('manual_location').value;
    const notes = document.getElementById('caller_notes').value;

    if (!location) {
        alert("Location details are mandatory for dispatch.");
        return;
    }

    const dispatchPayload = {
        booker_id: activeCustomerData.id,
        service_type: issue,
        customer_notes: notes,
        latitude: activeCustomerData.last_known_lat || 0, // Fallback if no GPS is available
        longitude: activeCustomerData.last_known_lng || 0,
        priority: 'URGENT', 
        source: 'HELPLINE'
    };

    // Post to the services API
    apiClient('services/request/', 'POST', dispatchPayload)
        .then(data => {
            if (data.status === 'DISPATCHED') {
                alert(`SUCCESS: Ticket #${data.id} dispatched! Provider assigned: ${data.provider_id}.`);
                document.getElementById('new-ticket-form').reset();
            } else {
                alert(`Dispatch Failed: ${data.message || 'Check provider availability.'}`);
            }
        })
        .catch(error => {
            console.error("Dispatch Error:", error);
            alert("Critical API error during dispatch.");
        });
}