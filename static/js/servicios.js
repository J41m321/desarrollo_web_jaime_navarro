document.addEventListener("DOMContentLoaded", () => {
    fetch("/data/servicios_activos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos cargados desde el JSON:", data);
            const servicesContainer = document.getElementById("services-container");

            servicesContainer.innerHTML = "";

            data.forEach((servicio, index) => {
                const serviceItem = document.createElement("div");
                serviceItem.classList.add("service-item");

                serviceItem.innerHTML = `
                    <h2>${servicio.nombre_servicio}</h2>
                    <p><strong>Inicio:</strong> ${servicio.dia_hora_inicio}</p>
                    <p><strong>Término:</strong> ${servicio.dia_hora_termino}</p>
                    <p><strong>Ubicación:</strong> ${servicio.region}, ${servicio.comuna}</p>
                    <p><strong>Sector:</strong> ${servicio.sector || "N/A"}</p>
                    <p><strong>Tipo:</strong> ${servicio.tipo}</p>
                    <div class="service-images">
                        ${servicio.fotos_servicio.map(foto => `<img src="/static/images/${foto}" alt="Imagen de ${servicio.nombre_servicio}" width="100">`).join('')}
                    </div>
                    <button class="detalle-btn" data-id="${index}">Ver Detalle</button>
                `;

                servicesContainer.appendChild(serviceItem);
            });

            document.querySelectorAll(".detalle-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const servicioId = event.target.getAttribute("data-id");
                    window.location.href = `detalle_servicio.html?id=${servicioId}`;
                });
            });
        })
        .catch(error => console.error("Error cargando los servicios:", error));
});