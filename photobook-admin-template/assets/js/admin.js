// Admin panel JavaScript (jQuery-based)
// All admin-specific scripts will be migrated here.

$(function() {
    // Enhanced admin dashboard functionality
    let revenueChart, userChart;

    // Initialize charts
    function initializeCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // User Distribution Chart
        const userCtx = document.getElementById('userChart').getContext('2d');
        userChart = new Chart(userCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active Users', 'Premium Users', 'New Users', 'Inactive'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        '#28a745',
                        '#007bff',
                        '#ffc107',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Real-time updates simulation
    function updateMetrics() {
        // Simulate real-time metric updates
        setInterval(() => {
            $('.metric-icon + div h3').each(function() {
                const currentValue = parseInt($(this).text().replace(/,/g, ''));
                const newValue = currentValue + Math.floor(Math.random() * 10);
                $(this).text(newValue.toLocaleString());
            });
        }, 30000); // Update every 30 seconds
    }

    // Activity timeline interactions
    function initializeActivityTimeline() {
        $('.activity-item').on('click', function() {
            $(this).css('background-color', 'rgba(0, 123, 255, 0.05)');
            setTimeout(() => {
                $(this).css('background-color', '');
            }, 200);
        });
    }

    // System status monitoring
    function updateSystemStatus() {
        $('.status-item .badge').each(function() {
            if ($(this).text().includes('%')) {
                const currentValue = parseInt($(this).text());
                const newValue = Math.max(0, Math.min(100, currentValue + (Math.random() - 0.5) * 10));
                $(this).text(Math.round(newValue) + '%');

                // Update badge color based on value
                if (newValue > 80) {
                    $(this).attr('class', 'badge bg-danger');
                } else if (newValue > 60) {
                    $(this).attr('class', 'badge bg-warning');
                } else {
                    $(this).attr('class', 'badge bg-success');
                }
            }
        });
    }

    // Quick actions
    function initializeQuickActions() {
        $('.quick-actions .btn').on('click', function(e) {
            if ($(this).attr('href') === '#') {
                e.preventDefault();
                // All showToast functions and calls have been removed for no toast notifications.
            }
        });
    }

    // Initialize dashboard
    initializeCharts();
    updateMetrics();
    initializeActivityTimeline();
    initializeQuickActions();

    // Update system status every 10 seconds
    setInterval(updateSystemStatus, 10000);

    // Add entrance animations
    $('.card').each(function(index) {
        $(this).css({
            opacity: '0',
            transform: 'translateY(20px)'
        });
        setTimeout(() => {
            $(this).css({
                transition: 'all 0.6s ease-out',
                opacity: '1',
                transform: 'translateY(0)'
            });
        }, index * 100);
    });
}); 