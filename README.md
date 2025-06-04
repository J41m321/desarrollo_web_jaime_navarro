# desarrollo_web_jaime_navarro
Repositorio para el curso CC5002 Desarrollo de Aplicaciones Web

# Desarrollo Tarea 3: AJAX

## Preparación del ambiente de desarrollo

* Creamos un entorno virtual:

```bash
python -m venv venv
```

* lo activamos:

```bash
venv\Scripts\activate
```

* instalamos los requerimientos (flask, SQLAlchemy):

```bash
pip install -r requirements.txt
```

## Ejecutar la aplicación

* para ejecutar la aplicación:

```bash
python run.py
```

* abrir el url http://127.0.0.1:5000 para ver la app

## Estructura del repositorio

```
desarrollo_web_jaime_navarro/
│
├── flask_project/          # Carpeta principal del proyecto Flask
│   ├── run.py              # Archivo principal para ejecutar la aplicación
│   ├── requirements.txt    # Dependencias del proyecto
│   ├── static/             # CSS, JS, imágenes
│   ├── templates/          # Plantillas HTML
│   ├── app/                # Código fuente de la aplicación
│       ├── __init__.py     # Inicialización del paquete Flask
│       ├── models.py       # Modelos de la base de datos
│       ├── routes.py       # Rutas de la aplicación
│       ├── config.py       # Configuración de la aplicación
│
├── README.md               # Archivo README con la descripción del proyecto
```