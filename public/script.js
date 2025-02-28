const apiBaseUrl = "http://localhost:5000";

// ✅ Fetch and display indices
async function loadIndices() {
    try {
        const response = await fetch(`${apiBaseUrl}/indices`);
        if (!response.ok) throw new Error("Failed to fetch indices");

        const indices = await response.json();
        const listElement = document.getElementById("companyList");
        listElement.innerHTML = "";

        indices.forEach((index) => {
            const li = document.createElement("li");
            li.textContent = index;
            li.classList.add("list-group-item");
            li.addEventListener("click", () => loadChartData(index));
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading indices:", error);
    }
}

// ✅ Fetch and display chart data
async function loadChartData(indexName) {
    try {
        const response = await fetch(`${apiBaseUrl}/index/${encodeURIComponent(indexName)}`);
        if (!response.ok) throw new Error(`Index '${indexName}' not found`);

        const data = await response.json();
        const labels = data.map((item) => item.date);
        const closePrices = data.map((item) => item.close);

        const ctx = document.getElementById("chart").getContext("2d");
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: `${indexName} Closing Prices`,
                        data: closePrices,
                        borderColor: "#1e3c72",
                        backgroundColor: "rgba(30, 60, 114, 0.2)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: "#2a5298",
                            font: { size: 16 }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: "#333" } },
                    y: { ticks: { color: "#333" } }
                }
            }
        });
    } catch (error) {
        console.error("Error loading chart data:", error);
    }
}

// ✅ Load data on page load
document.addEventListener("DOMContentLoaded", loadIndices);
