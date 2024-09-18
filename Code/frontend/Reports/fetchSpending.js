let myChart = null;

const dateInput = document.getElementById('dateInput');
const currentDate = new Date();
const year = currentDate.getFullYear();
const monthIndex = currentDate.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const month = monthNames[monthIndex];
dateInput.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
document.querySelector('.date').textContent = `${month} ${year}`;


const userData = JSON.parse(localStorage.getItem('userData'));

// Function to fetch spending data
async function getSpending(date) {
    try {
        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/CategoryController.php?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userData.jwt,
            }
        });

        // Clear previous chart content and destroy existing Chart
        const myChartContainer = document.querySelector('.chart-container');
        if (myChart) {
            myChart.destroy();
        }

        // Create new canvas element and append to the container
        const myChartCanvas = document.createElement('canvas');
        myChartContainer.innerHTML = '';
        myChartContainer.appendChild(myChartCanvas);

        if (response.ok) {
            const result = await response.json();
            const data = result.data;

            let labels = [];
            let values = [];

            let totalSpending = 0;
            data.forEach((item) => {
                if (item.total_spending != null) {
                    labels.push(item.category_type);
                    values.push(parseFloat(item.total_spending));
                    totalSpending += parseFloat(item.total_spending);
                }
                else{
                    myChartContainer.innerHTML = '<p>No data available for the selected date.</p>';    
                }
            });

            document.querySelector('.total-spending-amount').textContent = `₹${totalSpending}`;
            const chartData = {
                labels: labels,
                datasets: [{
                    label: "Spending",
                    data: values,
                    backgroundColor: [
                        "#7E9EEF",
                        "#83DD3F",
                        "#190582"
                    ]
                }]
            };

            myChart = new Chart(myChartCanvas, {
                type: "doughnut",
                data: chartData,
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });

        } else {
            myChartContainer.innerHTML = '<p>No data available for the selected date.</p>';
        }
    }
    catch (error) {
        console.log(error);
    }
}

getSpending(dateInput.value);

// Fetch spending data when the date changes
dateInput.addEventListener('change', (event) => {
    const newDate = event.target.value;
    const newYear = newDate.substring(0, 4);
    const newMonthIndex = parseInt(newDate.substring(5, 7), 10) - 1;
    const newMonth = monthNames[newMonthIndex];
    document.querySelector('.date').textContent = `${newMonth} ${newYear}`;
    getSpending(1, newDate);
});
