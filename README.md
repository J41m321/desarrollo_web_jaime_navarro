# desarrollo_web_jaime_navarro
Repositorio para el curso CC5002 Desarrollo de Aplicaciones Web

# Desarrollo de Tarea 1:

## Live Server

La manera más rápida y sencilla de lanzar un servidor locar para visualizar la tarea es usar la extensión de vscode `live server` : https://marketplace.visualstudio.com/items/?itemName=ritwickdey.LiveServer. La tarea fue desarrollada gracias a esta extensión.


## Alternativa: Servidor HTTP simple con Python

El módulo `http.server` de Python 3 para levantar un servidor HTTP básico y mostrar archivos HTML desde el directorio `templates`.

Este se ejecuta con:

```bash
python3 -m http.server 8000
```

## La estructura del proyecto

```bash
desarrollo_web_jaime_navarro/
├── data/
│   ├── servicios_activos.json       # Archivo JSON con los datos ficticios de los servicios
│   └── region_comuna.json           # Archivo JSON con las regiones y comunas
│
├── static/
│   ├── css/
│   │   └── style.css                # Archivo CSS para los estilos de la aplicación
│   ├── images/
│   │   ├── grafico_lineas.png       # Gráfico de líneas
│   │   ├── grafico_torta.png        # Gráfico de torta
│   │   ├── grafico_barras.png       # Gráfico de barras
│   │   └── (otras imágenes de servicios)
│   └── js/
│      ├── index.js                 # Script para la página principal
│      ├── servicios.js             # Script para la lista de servicios
│      ├── detalle_servicio.js      # Script para la vista de detalle de un servicio
│      └── agrega_servicio.js       # Script para agregar un nuevo servicio
│   
├── templates/
│   ├── index.html                   # Página principal
│   ├── servicios.html               # Página con la lista de servicios
│   ├── detalle_servicio.html        # Página de detalle de un servicio
│   ├── estadisticas.html            # Página con los gráficos de estadísticas
│   ├── agrega_servicio.html         # Página para agregar un nuevo servicio
│   └── (otras vistas sin uso de momento)
│
└── README.md                        # Archivo README con la descripción del proyecto
```