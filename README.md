# desarrollo_web_jaime_navarro
Repositorio para el curso CC5002 Desarrollo de Aplicaciones Web.

Este proyecto es una aplicación web que permite a los usuarios crear y gestionar servicios como barberías, consultas dentales, jardinería, clases particulares, turismo, entre otros. Los potenciales clientes pueden agendar horas para estos servicios de manera sencilla a través de la plataforma.

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

## Preparación de la Base de datos MySql

* Dentro de la carpeta *init_sql* se encuentran los scripts que deben ser ejecutados en la consola de MySql. El orden en que se ejecutaron en el siguiente orden:

```bash
mysql -u tu_usuario -p < init_sql/tarea2.sql
mysql -u tu_usuario -p tarea2 < init_sql/region-comuna.sql
mysql -u tu_usuario -p < init_sql/tabla-comentario.sql
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