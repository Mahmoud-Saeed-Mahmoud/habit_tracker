// Constants
const BUTTON_STATES = {
    DEFAULT: {
        class: 'btn-success',
        icon: 'bi-check-circle',
        text: 'Mark Complete'
    },
    LOADING: {
        text: 'Loading...'
    },
    SUCCESS: {
        class: 'btn-info',
        icon: 'bi-check-circle-fill',
        text: 'Completed!'
    },
    ERROR: {
        class: 'btn-danger',
        icon: 'bi-exclamation-circle',
        text: 'Error - Try Again'
    }
};

// Button state management
class HabitButton {
    constructor(buttonElement) {
        this.button = buttonElement;
        this.defaultContent = this.button.querySelector('.default-content');
        this.loadingContent = this.button.querySelector('.loading-content');
    }

    setState(state, isLoading = false) {
        // Reset all states
        this.button.classList.remove('btn-success', 'btn-info', 'btn-danger');
        
        if (isLoading) {
            this.defaultContent.classList.add('d-none');
            this.loadingContent.classList.remove('d-none');
            this.button.disabled = true;
            return;
        }

        // Update button state
        this.button.classList.add(state.class);
        this.defaultContent.innerHTML = `<i class="bi ${state.icon}"></i> ${state.text}`;
        this.defaultContent.classList.remove('d-none');
        this.loadingContent.classList.add('d-none');
    }

    reset(enable = true) {
        this.setState(BUTTON_STATES.DEFAULT);
        this.button.disabled = !enable;
    }
}

// Habit completion handling
async function logCompletion(habitId, buttonElement) {
    const button = new HabitButton(buttonElement);
    button.setState(null, true); // Show loading state

    try {
        const response = await fetch(`/log_completion/${habitId}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            button.setState(BUTTON_STATES.SUCCESS);
            await updateStats(habitId);
            
            // Reset button after delay
            setTimeout(() => button.reset(), 1500);
        } else {
            throw new Error('Completion failed');
        }
    } catch (error) {
        button.setState(BUTTON_STATES.ERROR);
        setTimeout(() => button.reset(), 2000);
        console.error('Error logging completion:', error);
    }
}

// Stats and chart management
async function updateStats(habitId) {
    try {
        const response = await fetch(`/get_stats/${habitId}`);
        const data = await response.json();
        
        // Update streak counter
        document.getElementById(`streak-${habitId}`).textContent = `🔥 ${data.current_streak}`;
        
        // Update chart
        updateHabitChart(habitId, data.completion_dates);
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function updateHabitChart(habitId, completionDates) {
    const ctx = document.getElementById(`chart-${habitId}`).getContext('2d');
    const chartData = generateChartData(completionDates);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Completed',
                data: chartData.values,
                backgroundColor: '#198754',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function generateChartData(completionDates) {
    const labels = [];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(dateStr.split('-')[2]); // Just show the day
        values.push(completionDates.includes(dateStr) ? 1 : 0);
    }
    
    return { labels, values };
}

// Initialize all habits on page load
document.addEventListener('DOMContentLoaded', () => {
    const habits = document.querySelectorAll('[id^="chart-"]');
    habits.forEach(habit => {
        const habitId = habit.id.replace('chart-', '');
        updateStats(habitId);
    });
});
