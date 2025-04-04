document.addEventListener("DOMContentLoaded", function () {
    fetch('/data/region_comuna.JSON')
        .then(response => response.json())
        .then(data => {
            const regiones = data.regiones;
            const regionSelect = document.getElementById("region");
            const comunaSelect = document.getElementById("comuna");

            regiones.forEach(region => {
                const option = document.createElement("option");
                option.value = region.nombre;
                option.textContent = region.nombre;
                regionSelect.appendChild(option);
            });

            regionSelect.addEventListener("change", function () {
                const regionSeleccionada = this.value;
                const comunas = regiones.find(region => region.nombre === regionSeleccionada)?.comunas || [];
                comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
                comunas.forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna.nombre;
                    option.textContent = comuna.nombre;
                    comunaSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error("Error al cargar el archivo JSON:", error));

    const contactarPorSelect = document.getElementById("contactar_por");
    const contactoIdInput = document.getElementById("contacto_id");
    contactarPorSelect.addEventListener("change", function () {
        if (this.value === "otra" || this.value) {
            contactoIdInput.classList.remove("hidden");
        } else {
            contactoIdInput.classList.add("hidden");
        }
    });

    const tipoSelect = document.getElementById("tipo");
    const tipoOtroInput = document.getElementById("tipo_otro");
    tipoSelect.addEventListener("change", function () {
        if (this.value === "otro") {
            tipoOtroInput.classList.remove("hidden");
        } else {
            tipoOtroInput.classList.add("hidden");
        }
    });

    const agregarFotoButton = document.getElementById("agregar-foto");
    const fotosContainer = document.getElementById("fotos-container");
    agregarFotoButton.addEventListener("click", function () {
        const inputs = fotosContainer.querySelectorAll("input[type='file']");
        if (inputs.length < 5) {
            const nuevoInput = document.createElement("input");
            nuevoInput.type = "file";
            nuevoInput.name = "fotos_servicio[]";
            nuevoInput.accept = "image/*";
            fotosContainer.appendChild(nuevoInput);
        } else {
            alert("No puedes agregar más de 5 fotos.");
        }
    });

    const diaHoraInicioInput = document.getElementById("dia_hora_inicio");
    const diaHoraTerminoInput = document.getElementById("dia_hora_termino");
    const ahora = new Date();
    const tresHorasDespues = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);

    diaHoraInicioInput.value = ahora.toISOString().slice(0, 16);
    diaHoraTerminoInput.value = tresHorasDespues.toISOString().slice(0, 16);

    diaHoraInicioInput.addEventListener("change", function () {
        const nuevaFechaInicio = new Date(this.value);
        const nuevaFechaTermino = new Date(nuevaFechaInicio.getTime() + 3 * 60 * 60 * 1000);
        diaHoraTerminoInput.value = nuevaFechaTermino.toISOString().slice(0, 16);
    });

    const formularioServicio = document.getElementById("formulario-servicio");
    formularioServicio.addEventListener("submit", function (event) {
        event.preventDefault();

        const confirmacion = confirm("¿Está seguro que desea agregar esta actividad?");
        if (!confirmacion) return;

        alert("Hemos recibido su información, muchas gracias y suerte en su servicio.");
        window.location.href = "index.html";
    });
});