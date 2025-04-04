document.addEventListener("DOMContentLoaded", function () {
    const jsonFilePath = "/data/servicios_activos.JSON";
    const serviciosLista = document.getElementById("servicios-lista");

    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON.");
            }
            return response.json();
        })
        .then(data => {

            const ultimosServicios = data.slice(-5).reverse();

            ultimosServicios.forEach(servicio => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${servicio.dia_hora_inicio}</td>
                    <td>${servicio.dia_hora_termino}</td>
                    <td>${servicio.comuna}</td>
                    <td>${servicio.sector || "N/A"}</td>
                    <td>${servicio.tipo}</td>
                    <td>
                        ${servicio.fotos_servicio.length > 0 
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