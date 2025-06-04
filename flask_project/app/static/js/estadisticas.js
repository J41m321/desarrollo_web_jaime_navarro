document.addEventListener("DOMContentLoaded", function () {
    // Gráfico de líneas:
    fetch("/api/estadisticas/dias")
        .then(res => res.json())
        .then(data => {
            new Chart(document.getElementById("grafico-lineas"), {
                type: "line",
                data: {
                    labels: data.dias,
                    datasets: [{
                        label: "Cantidad de servicios",
                        data: data.cantidades,
                        borderColor: "#007bff",
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { // esto es para que no use decimales
                                stepSize: 1,
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : null;
                                }
                            }
                        }
                    }
                }
            });
        });

    // Gráfico de torta:
    fetch("/api/estadisticas/tipos")
        .then(res => res.json())
        .then(data => {
            new Chart(document.getElementById("grafico-torta"), {
                type: "pie",
                data: {
                    labels: data.tipos,
                    datasets: [{
                        data: data.cantidades,
                        backgroundColor: [
                            "#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"
                        ]
                    }]
                }
            });
        });

    // Gráfico de barras:
    fetch("/api/estadisticas/horarios")
        .then(res => res.json())
        .then(data => {
            new Chart(document.getElementById("grafico-barras"), {
                type: "bar",
                data: {
                    labels: data.meses,
                    datasets: [
                        {
                            label: "Mañana",
                            data: data.manana,
                            backgroundColor: "#007bff"
                        },
                        {
                            label: "Mediodía",
                            data: data.mediodia,
                            backgroundColor: "#ffc107"
                        },
                        {
                            label: "Tarde",
                            data: data.tarde,
                            backgroundColor: "#28a745"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { stacked: true },
                        y: { beginAtZero: true,
                             stacked: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : null;
                                }
                            } }
                    }
                }
            });
        });
});