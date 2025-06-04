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

    const comentariosList = document.getElementById("lista-comentarios");
    const formComentario = document.getElementById("form-comentario");
    const erroresDiv = document.getElementById("comentario-errores");

    function cargarComentarios() {
        fetch(`/api/comentarios/${servicioId}`)
            .then(res => res.json())
            .then(data => {
                comentariosList.innerHTML = "";
                if (data.length === 0) {
                    comentariosList.innerHTML = "<li>No hay comentarios aún.</li>";
                } else {
                    data.forEach(c => {
                        const li = document.createElement("li");
                        li.innerHTML = `<strong>${c.nombre}</strong> (${c.fecha}):<br>${c.texto}`;
                        comentariosList.appendChild(li);
                    });
                }
            });
    }

    formComentario.addEventListener("submit", function(e) {
        e.preventDefault();
        erroresDiv.textContent = "";
        const nombre = document.getElementById("nombre-comentario").value.trim();
        const texto = document.getElementById("texto-comentario").value.trim();

        let errores = [];
        if (nombre.length < 3 || nombre.length > 80) {
            errores.push("El nombre debe tener entre 3 y 80 caracteres.");
        }
        if (texto.length < 5) {
            errores.push("El comentario debe tener al menos 5 caracteres.");
        }
        if (errores.length > 0) {
            erroresDiv.textContent = errores.join(" ");
            return;
        }

        fetch(`/api/comentarios/${servicioId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, texto })
        })
        .then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(({status, body}) => {
            if (!body.ok) {
                erroresDiv.textContent = (body.errores || ["Error al agregar comentario"]).join(" ");
            } else {
                formComentario.reset();
                cargarComentarios();
            }
        });
    });

    if (servicioId) {
        cargarComentarios();
    }
});