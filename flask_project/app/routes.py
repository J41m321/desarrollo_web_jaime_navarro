import os
from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import db, Servicio, Comuna, ServicioTipo, Foto
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('index.html')

@main.route('/servicios')
def servicios():
    servicios = Servicio.query.all()
    return render_template('servicios.html', servicios=servicios)

@main.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

@main.route('/agrega_servicio', methods=['GET', 'POST'])
def agrega_servicio():
    if request.method == 'POST':
        try:
            images_dir = os.path.join(os.getcwd(), 'app', 'static', 'images')
            if not os.path.exists(images_dir):
                os.makedirs(images_dir)

            comuna_id = request.form.get('comuna')
            sector = request.form.get('sector')
            nombre = request.form.get('nombre_servicio')
            email = request.form.get('email_servicio')
            celular = request.form.get('numero_celular')
            dia_hora_inicio = datetime.strptime(request.form.get('dia_hora_inicio'), '%Y-%m-%dT%H:%M')
            dia_hora_termino = request.form.get('dia_hora_termino')
            descripcion = request.form.get('descripcion')
            tipo = request.form.get('tipo')
            tipo_otro = request.form.get('tipo_otro') if tipo == 'otro' else None

            dia_hora_termino = datetime.strptime(dia_hora_termino, '%Y-%m-%dT%H:%M') if dia_hora_termino else None

            nuevo_servicio = Servicio(
                comuna_id=comuna_id,
                sector=sector,
                nombre=nombre,
                email=email,
                celular=celular,
                dia_hora_inicio=dia_hora_inicio,
                dia_hora_termino=dia_hora_termino,
                descripcion=descripcion
            )
            db.session.add(nuevo_servicio)
            db.session.flush()

            nuevo_tipo = ServicioTipo(
                tipo=tipo,
                glosa_otro=tipo_otro,
                servicio_id=nuevo_servicio.id
            )
            db.session.add(nuevo_tipo)

            fotos = request.files.getlist('fotos_servicio[]')
            for foto in fotos:
                if foto and foto.filename:
                    ruta_archivo = os.path.join(images_dir, foto.filename)
                    foto.save(ruta_archivo)
                    nueva_foto = Foto(
                        ruta_archivo=ruta_archivo,
                        nombre_archivo=foto.filename,
                        servicio_id=nuevo_servicio.id
                    )
                    db.session.add(nueva_foto)

            db.session.commit()

            flash('Servicio agregado correctamente.', 'success')
            return redirect(url_for('main.home'))
        except Exception as e:
            db.session.rollback()
            print(f"Error al agregar el servicio: {e}")
            flash(f'Error al agregar el servicio: {str(e)}', 'danger')
            return redirect(url_for('main.agrega_servicio'))

    return render_template('agrega_servicio.html')