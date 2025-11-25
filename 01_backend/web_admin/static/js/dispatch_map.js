// NOTE: This code assumes global access to the Google Maps object and uses standard WebSocket.

let map;
let providers = new Map(); // Map to store provider markers (ID -> Marker Object)
let requests = new Map();  // Map to store request markers (ID -> Marker Object)
let activeRequestId = null;

// Initialize Google Map (called by the Google Maps script)
function initLiveMap() {
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    map = new google.maps.Map(document.getElementById('live-map-container'), {
        center: defaultCenter,
        zoom: 5,
        mapId: 'VEHIC_AID_DISPATCH_MAP' // Use custom map style ID if available
    });

    // Setup WebSocket for Real-Time Updates
    setupWebSocket();
    
    // Add event listeners for assigning providers on map click
    map.addListener('click', handleMapClickForAssignment);
}

// Sets up WebSocket connection using Django Channels
function setupWebSocket() {
    // Replace with your actual WebSocket URL structure
    const wsStart = (window.location.protocol === 'https:' ? 'wss://' : 'ws://');
    const wsUrl = wsStart + window.location.host + '/ws/dispatch/live/';
    
    const dispatchSocket = new WebSocket(wsUrl);

    dispatchSocket.onopen = (e) => { console.log("Dispatch Socket Connected."); };
    dispatchSocket.onmessage = (e) => { handleRealTimeData(JSON.parse(e.data)); };
    dispatchSocket.onclose = (e) => { console.log("Dispatch Socket Closed."); };
    dispatchSocket.onerror = (e) => { console.error("Dispatch Socket Error:", e); };
}

// Processes incoming real-time data from the backend
function handleRealTimeData(data) {
    if (data.type === 'provider_location') {
        updateProviderMarker(data.provider_id, data.lat, data.lng, data.is_available);
    } else if (data.type === 'new_request' || data.type === 'update_request') {
        updateRequestMarker(data.request_id, data.lat, data.lng, data.priority);
        updateRequestList(data.request_id, data.service_type, data.address);
    } else if (data.type === 'request_removed') {
        removeMarker(requests, data.request_id);
    }
}

// Creates or moves a provider marker on the map
function updateProviderMarker(id, lat, lng, is_available) {
    const position = { lat: lat, lng: lng };
    const iconUrl = is_available ? '/static/img/icons/map_pin_provider.png' : '/static/img/icons/map_pin_busy.png';

    let marker = providers.get(id);

    if (marker) {
        marker.setPosition(position);
        marker.setIcon(iconUrl);
    } else {
        marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: { url: iconUrl, scaledSize: new google.maps.Size(40, 40) },
            title: `Provider ID: ${id}`
        });
        providers.set(id, marker);
        
        // Add listener for manual assignment
        marker.addListener('click', () => { handleProviderClickForAssignment(id); });
    }
}

// Placeholder for handling manual assignment flow
function handleProviderClickForAssignment(providerId) {
    if (activeRequestId) {
        const confirmAssign = confirm(`Assign Provider ${providerId} to Request ${activeRequestId}?`);
        if (confirmAssign) {
            // Send assignment command to backend
            // sendAssignmentToBackend(activeRequestId, providerId);
            alert(`Assigned Request ${activeRequestId} to Provider ${providerId}`);
            activeRequestId = null; // Reset assignment mode
            // Visually update the request list (remove the item)
        }
    }
}

// Helper to remove markers
function removeMarker(mapStore, id) {
    const marker = mapStore.get(id);
    if (marker) {
        marker.setMap(null);
        mapStore.delete(id);
    }
}

// Function called from the Request Queue list item click
function startManualAssignment(requestId) {
    activeRequestId = requestId;
    alert(`Assignment Mode: Click a provider on the map to assign to Request ${requestId}`);
    // Highlight the selected request in the list for clarity
    document.querySelectorAll('.request-item').forEach(el => el.classList.remove('selected-for-assignment'));
    document.querySelector(`.request-item[data-request-id="${requestId}"]`).classList.add('selected-for-assignment');
}
```eof

### 1.2. `js/data_visualizer.js` (Financial and Operational Charts)

This uses Chart.js to render the impressive, responsive visualizations on the Admin Dashboard (`admin/dashboard.html`).

```javascript:Data Visualizer:backend/web-admin/static/js/data_visualizer.js
// NOTE: This assumes Chart.js is loaded in the base template.

const CHART_COLORS = {
    primary: '#007bff', // Blue
    accent: '#ffc107',  // Yellow
    success: '#28a745', // Green
    danger: '#dc3545',  // Red
    muted: '#6c757d'   // Gray
};

/**
 * Fetches data and initializes all charts on the Admin Dashboard.
 */
function initCharts() {
    // Fetch data from a secure API endpoint
    // fetch('/api/v1/admin/dashboard-data/')
    //     .then(res => res.json())
    //     .then(data => {
    //         renderRevenueChart(data.revenueData);
    //         renderServiceVolumeChart(data.serviceVolume);
    //     })
    //     .catch(error => console.error("Error fetching chart data:", error));
    
    // --- Mock Data for Immediate Rendering ---
    const mockRevenueData = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        platform: [150, 180, 200, 250, 230, 280], // Commission in Thousands
        payouts: [600, 720, 800, 1000, 920, 1120] // Total Payouts in Thousands
    };
    const mockServiceVolume = {
        labels: ['Towing', 'Jumpstart', 'Flat Tire', 'Fuel'],
        counts: [4500, 3200, 5800, 1500]
    };
    
    renderRevenueChart(mockRevenueData);
    renderServiceVolumeChart(mockServiceVolume);
}

/**
 * Renders the primary line chart for Revenue vs. Payouts.
 */
function renderRevenueChart(data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Platform Commission (k)',
                    data: data.platform,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Payouts (k)',
                    data: data.payouts,
                    borderColor: CHART_COLORS.accent,
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

/**
 * Renders the bar chart for Service Volume Breakdown.
 */
function renderServiceVolumeChart(data) {
    const ctx = document.getElementById('serviceVolumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Requests Count',
                data: data.counts,
                backgroundColor: [
                    CHART_COLORS.danger,
                    CHART_COLORS.success,
                    CHART_COLORS.primary,
                    CHART_COLORS.muted
                ],
                hoverBackgroundColor: CHART_COLORS.primary_dark
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Global hook to initialize charts when the page content is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('revenueChart')) {
        initCharts();
    }
});
```eof

### 1.3. `js/helpline_logic.js` (Agent Workflow and Call Handling)

This script manages the internal logic for the Helpline agent console, enabling quick search and manual ticket creation.

```javascript:Helpline Workflow:backend/web-admin/static/js/helpline_logic.js
// NOTE: This code relies on the structure defined in helpline/call_view.html and an API client (main.js).

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

    // Assume a client function exists in main.js to make secure API calls
    const apiEndpoint = `/api/v1/users/lookup/`; 
    
    // Simulate the search based on input type
    const payload = {
        identifier: searchInput,
        type: searchInput.startsWith('IOT-') ? 'IOT_ID' : 'PHONE'
    };

    // Use fetch or the main.js API client function
    fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.user) {
            activeCustomerData = data.user;
            updateCallerDetails(data.user);
        } else {
            alert("User not found. Check ID or proceed as a new user.");
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
    document.querySelector('.call-status-widget').classList.remove('status-ringing');
    document.querySelector('.call-status-widget').classList.add('status-active-call');
    document.getElementById('call-status-text').textContent = 'USER LOADED';

    // Load ticket history (could be another API call or part of initial data)
    // loadTicketHistory(user.id); 
}

/**
 * Resets the UI fields when a caller is not found or search fails.
 */
function resetCallerDetails() {
    document.getElementById('user-name').textContent = 'N/A';
    document.getElementById('user-subscription').textContent = 'Unregistered / Free Plan';
    document.getElementById('user-vehicle').textContent = 'None';
    document.getElementById('user-last-location').textContent = 'No data';
    document.querySelector('.call-status-widget').classList.remove('status-active-call');
    document.querySelector('.call-status-widget').classList.add('status-ringing');
    document.getElementById('call-status-text').textContent = 'CALL IN PROGRESS...';
    activeCustomerData = null;
}


/**
 * Submits the manually created service ticket to the backend.
 */
function dispatchManualRequest() {
    if (!activeCustomerData) {
        alert("Please load or manually input customer data before dispatching.");
        return;
    }
    
    const issue = document.getElementById('issue').value;
    const location = document.getElementById('manual_location').value;
    const notes = document.getElementById('caller_notes').value;

    if (!location) {
        alert("Location is mandatory for dispatch.");
        return;
    }

    const dispatchPayload = {
        user_id: activeCustomerData.id,
        service_type: issue,
        location_notes: location,
        agent_notes: notes,
        # Default priority to Urgent since it's from the Helpline
        priority: 'URGENT', 
        source: 'HELPLINE'
    };

    // Post to the services API
    fetch('/api/v1/services/request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchPayload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'DISPATCHED') {
            alert(`SUCCESS: Ticket #${data.id} dispatched! Provider assigned: ${data.provider_id}`);
            // Clear form and reset the view
            document.getElementById('new-ticket-form').reset();
        } else {
            alert(`Dispatch Failed: ${data.message || 'Unknown error.'}`);
        }
    })
    .catch(error => {
        console.error("Dispatch Error:", error);
        alert("Critical API error during dispatch.");
    });
}
```eof

### 1.4. `js/main.js` (Global Utilities)

This utility script handles general initialization, authentication token management, and global functions.

```javascript:Global Utilities:backend/web-admin/static/js/main.js
// Global Utility and Initialization Script for Admin/Helpline UI

const API_BASE_URL = '/api/v1/';

// --- Authentication and Token Management ---
function getAuthToken() {
    // In a production Django admin setup, JWT is usually stored in cookies or session
    // For simplicity, this assumes a utility to retrieve a staff/admin JWT
    return localStorage.getItem('access_token'); 
}

// --- Global API Client Function ---
function apiClient(endpoint, method = 'GET', data = null) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        // Authorization header is only needed for internal API calls, not webhooks
        ...(token && { 'Authorization': `Bearer ${token}` }) 
    };

    const config = {
        method: method,
        headers: headers,
        ...(data && { body: JSON.stringify(data) })
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config)
        .then(response => {
            if (!response.ok) {
                // Handle 401 Unauthorized globally
                if (response.status === 401) {
                    console.error("Authentication expired. Redirecting to login.");
                    // window.location.href = '/admin/login/'; 
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

// --- Initialization and Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize sidebar collapsing/expanding logic
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        // Placeholder for complex sidebar logic if needed
    }

    // 2. Initialize the global search bar placeholder logic
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Simulate redirect to a search results page
                // window.location.href = `/admin/search/?q=${searchInput.value}`;
                console.log(`Global search initiated for: ${searchInput.value}`);
            }
        });
    }

    // 3. Apply active state to current navigation link
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (path.includes(link.getAttribute('href').replace(/\//g, ''))) {
            link.parentNode.classList.add('active');
        }
    });

    // 4. Check if we need to initialize Chart.js functions
    if (typeof initCharts !== 'undefined') {
        initCharts();
    }
});
```eof

### 2. Django Management File

### 2.1. `manage.py`

```python:Django Management Entry Point:manage.py
import os
import sys

def main():
    """Run administrative tasks."""
    # This line ensures the correct settings are loaded.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vehic_aid_backend.settings.development')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```eof