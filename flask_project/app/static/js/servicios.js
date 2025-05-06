document.addEventListener("DOMContentLoaded", () => {
    const servicesContainer = document.getElementById("services-container");
    const paginationContainer = document.getElementById("pagination-container");
    let currentPage = 1;
    const perPage = 5;

    function cargarServicios(page = 1) {
        fetch(`/api/servicios?page=${page}&per_page=${perPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar la lista de servicios.");
                }
                return response.json();
            })
            .then(data => {
                servicesContainer.innerHTML = "";
                paginationContainer.innerHTML = "";

                data.servicios.forEach(servicio => {
                    const serviceItem = document.createElement("div");
                    serviceItem.classList.add("service-item");
                    serviceItem.dataset.id = servicio.id;

                    serviceItem.innerHTML = `
                        <h2>${servicio.nombre_servicio}</h2>
                        <p><strong>Inicio:</strong> ${servicio.dia_hora_inicio}</p>
                        <p><strong>Término:</strong> ${servicio.dia_hora_termino || "N/A"}</p>
                        <p><strong>Ubicación:</strong> ${servicio.region}, ${servicio.comuna}</p>
                        <p><strong>Sector:</strong> ${servicio.sector || "N/A"}</p>
                        <p><strong>Tipo:</strong> ${servicio.tipo}</p>
                    `;

                    serviceItem.addEventListener("click", () => {
                        window.location.href = `/detalle_servicio?id=${servicio.id}`;
                    });
                    servicesContainer.appendChild(serviceItem);
                });

                // Crear botones de paginación
                if (data.current_page > 1) {
                    const prevButton = document.createElement("button");
                    prevButton.textContent = "Anterior";
                    prevButton.addEventListener("click", () => cargarServicios(data.current_page - 1));
                    paginationContainer.appendChild(prevButton);
                }

                if (data.current_page < data.pages) {
                    const nextButton = document.createElement("button");
                    nextButton.textContent = "Siguiente";
                    nextButton.addEventListener("click", () => cargarServicios(data.current_page + 1));
                    paginationContainer.appendChild(nextButton);
                }
            })
            .catch(error => console.error("Error cargando los servicios:", error));
    }

    cargarServicios(currentPage);
});