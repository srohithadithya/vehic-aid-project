// Global Utility and Initialization Script for Admin/Helpline UI

const API_BASE_URL = '/api/v1/';

// --- Authentication and Token Management ---
function getAuthToken() {
    // Fetches the JWT token, typically stored in a cookie or session storage after login.
    // Assuming the token is stored in localStorage for simplified demonstration.
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
                // Global Unauthorized check
                if (response.status === 401) {
                    console.error("Authentication expired. Redirecting to login.");
                    // In a real Django setup, redirect to the login page:
                    // window.location.href = '/admin/login/'; 
                }
                throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
            }
            return response.json();
        });
}

// --- Initialization and Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize sidebar logic (expand/collapse can be added here)
    const sidebar = document.getElementById('sidebar');
    // ...

    // 2. Initialize the global search bar logic (Admin/Helpline Header)
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Simulating a dedicated search endpoint call
                console.log(`Global search initiated for: ${searchInput.value}`);
                // apiClient(`admin/search/?q=${searchInput.value}`, 'GET').then(results => ...);
            }
        });
    }

    // 3. Apply active state to current navigation link
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        // Simple check to set active class based on current URL path
        if (path.includes(link.getAttribute('href').replace(/\//g, ''))) {
            link.parentNode.classList.add('active');
        }
    });

    // 4. Initialize Chart.js functions if they exist on the page (Dashboard view)
    if (typeof initCharts === 'function' && document.getElementById('revenueChart')) {
        initCharts();
    }
});