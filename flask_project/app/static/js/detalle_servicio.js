document.addEventListener("DOMContentLoaded", () => {
    const detalleServicio = document.getElementById("detalle-servicio");
    const params = new URLSearchParams(window.location.search);
    const servicioId = params.get("id");
    const volverListado = document.getElementById("volver-listado");
    const volverPortada = document.getElementById("volver-portada");

    volverListado.addEventListener("click", () => {
        window.location.href = "/servicios";
    });

    volverPortada.addEventListener("click", () => {
        window.location.href = "/";
    });

    if (!servicioId) {
        detalleServicio.innerHTML = "<p>Error: No se proporcionó un ID de servicio.</p>";
        return;
    }

    fetch(`/api/servicio/${servicioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el detalle del servicio.");
            }
            return response.json();
        })
        .then(servicio => {
            detalleServicio.innerHTML = `
                <h2>${servicio.nombre_servicio}</h2>
                <p><strong>Inicio:</strong> ${servicio.dia_hora_inicio}</p>
                <p><strong>Término:</strong> ${servicio.dia_hora_termino || "N/A"}</p>
                <p><strong>Ubicación:</strong> ${servicio.region}, ${servicio.comuna}</p>
                <p><strong>Sector:</strong> ${servicio.sector || "N/A"}</p>
                <p><strong>Tipo:</strong> ${servicio.tipo}</p>
                <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
                <div class="service-images">
                    ${servicio.fotos_servicio.map(foto => `<img src="/static/images/${foto}" alt="Imagen de ${servicio.nombre_servicio}" width="200">`).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error("Error cargando el detalle del servicio:", error);
            detalleServicio.innerHTML = "<p>Error al cargar el detalle del servicio.</p>";
        });
});