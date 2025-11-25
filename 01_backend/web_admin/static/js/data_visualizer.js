// NOTE: This assumes Chart.js is loaded in the base template.

const CHART_COLORS = {
    primary: '#007bff', 
    primary_dark: '#0056b3',
    accent: '#ffc107',  
    success: '#28a745', 
    danger: '#dc3545',  
    muted: '#6c757d'   
};

/**
 * Fetches data and initializes all charts on the Admin Dashboard.
 */
function initCharts() {
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
    
    // In production, this would call: apiClient('admin/dashboard-data/', 'GET').then(data => {...});

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
            plugins: { title: { display: true, text: 'Financial Performance: Platform vs. Payouts' } },
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
```eof