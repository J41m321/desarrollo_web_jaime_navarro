document.addEventListener("DOMContentLoaded", () => {
    const detalleServicio = document.getElementById("detalle-servicio");
    const volverListado = document.getElementById("volver-listado");
    const volverPortada = document.getElementById("volver-portada");
    const agradaImagen = document.getElementById("agranda-imagen");

    const params = new URLSearchParams(window.location.search);
    const servicioId = params.get("id");

    if (!servicioId) {
        detalleServicio.innerHTML = "<p>Error: No se encontró el servicio.</p>";
        return;
    }

    fetch("/data/servicios_activos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON.");
            }
            return response.json();
        })
        .then(data => {
            const servicio = data[servicioId];
            if (!servicio) {
                detalleServicio.innerHTML = "<p>Error: No se encontró el servicio.</p>";
                return;
            }

            detalleServicio.innerHTML = `
                <h2>${servicio.nombre_servicio}</h2>
                <p><strong>Inicio:</strong> ${servicio.dia_hora_inicio}</p>
                <p><strong>Término:</strong> ${servicio.dia_hora_termino}</p>
                <p><strong>Ubicación:</strong> ${servicio.region}, ${servicio.comuna}</p>
                <p><strong>Sector:</strong> ${servicio.sector || "N/A"}</p>
                <p><strong>Tipo:</strong> ${servicio.tipo}</p>
                <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
                <div class="service-images">
                    ${servicio.fotos_servicio.map(foto => `
                        <img 
                            src="/static/images/${foto}" 
                            alt="Imagen de ${servicio.nombre_servicio}" 
                            width="320" 
                            height="240"
                            style="cursor: pointer;"
                            onclick="mostrarImagen('/static/images/${foto}')">
                    `).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error("Error cargando el servicio:", error);
            detalleServicio.innerHTML = "<p>Error al cargar el servicio.</p>";
        });

    window.mostrarImagen = (src) => {
        agradaImagen.hidden = false;
        agradaImagen.innerHTML = `
            <div class="agranda-imagen-content">
                <img src="${src}" alt="Imagen ampliada" width="800" height="600">
                <button id="cerrar-imagen">Cerrar</button>
            </div>
        `;
        detalleServicio.hidden=true;

        document.getElementById("cerrar-imagen").addEventListener("click", () => {
            agradaImagen.hidden = true;
            detalleServicio.hidden=false;
        });
    };

    volverListado.addEventListener("click", () => {
        window.location.href = "servicios.html";
    });

    volverPortada.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});