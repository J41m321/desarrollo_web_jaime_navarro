document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "/api/ultimos_servicios";
    const serviciosLista = document.getElementById("servicios-lista");

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener los servicios desde el servidor.");
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                serviciosLista.innerHTML = `<tr><td colspan="6">No hay servicios disponibles.</td></tr>`;
                return;
            }
            data.forEach(servicio => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${servicio.dia_hora_inicio}</td>
                    <td>${servicio.dia_hora_termino || "N/A"}</td>
                    <td>${servicio.comuna}</td>
                    <td>${servicio.sector || "N/A"}</td>
                    <td>${servicio.tipo || "N/A"}</td>
                    <td>
                        ${servicio.fotos_servicio && servicio.fotos_servicio.length > 0 
                            ? `<img src="/static/images/${servicio.fotos_servicio[0]}" alt="Foto del servicio" width="100">`
                            : "Sin foto"}
                    </td>
                `;

                serviciosLista.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar los servicios:", error);
            serviciosLista.innerHTML = `<tr><td colspan="6">No se pudieron cargar los servicios.</td></tr>`;
        });
});