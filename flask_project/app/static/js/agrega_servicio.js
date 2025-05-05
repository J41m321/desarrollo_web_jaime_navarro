document.addEventListener("DOMContentLoaded", function () {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");
    const formularioServicio = document.getElementById("formulario-servicio");
    const tipoSelect = document.getElementById("tipo");
    const tipoOtroInput = document.getElementById("tipo_otro");
    const agregarFotoButton = document.getElementById("agregar-foto");
    const fotosContainer = document.getElementById("fotos-container");

    fetch("/api/region_comuna")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener las regiones y comunas desde el servidor.");
            }
            return response.json();
        })
        .then(data => {
            data.forEach(region => {
                const option = document.createElement("option");
                option.value = region.region_id;
                option.textContent = region.region_nombre;
                regionSelect.appendChild(option);
            });

            regionSelect.addEventListener("change", function () {
                const regionId = regionSelect.value;

                comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
                const region = data.find(r => r.region_id == regionId);
                if (region) {
                    region.comunas.forEach(comuna => {
                        const option = document.createElement("option");
                        option.value = comuna.comuna_id;
                        option.textContent = comuna.comuna_nombre;
                        comunaSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar regiones y comunas:", error);
        });

    tipoSelect.addEventListener("change", function () {
        if (tipoSelect.value === "otro") {
            tipoOtroInput.classList.remove("hidden");
        } else {
            tipoOtroInput.classList.add("hidden");
        }
    });

    agregarFotoButton.addEventListener("click", function () {
        const nuevaFoto = document.createElement("input");
        nuevaFoto.type = "file";
        nuevaFoto.name = "fotos_servicio[]";
        nuevaFoto.accept = "image/*";
        fotosContainer.appendChild(nuevaFoto);
    });

    formularioServicio.addEventListener("submit", function (event) {
        event.preventDefault();

        const confirmacion = confirm("¿Está seguro que desea agregar esta actividad?");
        if (!confirmacion) return;

        alert("Hemos recibido su información, muchas gracias y suerte en su servicio.");
        formularioServicio.submit();
    });
});