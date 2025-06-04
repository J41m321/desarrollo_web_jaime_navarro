from flask import Blueprint, jsonify, request
from .models import Servicio, Region, Comuna, ServicioTipo, Comentario, db
from sqlalchemy import func
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/api/ultimos_servicios')
def ultimos_servicios():
    servicios = Servicio.query.order_by(Servicio.id.desc()).limit(5).all()
    servicios_data = [
        {
            'dia_hora_inicio': servicio.dia_hora_inicio.strftime('%Y-%m-%d %H:%M'),
            'dia_hora_termino': servicio.dia_hora_termino.strftime('%Y-%m-%d %H:%M') if servicio.dia_hora_termino else None,
            'comuna': servicio.comuna.nombre,
            'sector': servicio.sector,
            'tipo': servicio.tipos[0].tipo if servicio.tipos else "N/A",
            'fotos_servicio': [foto.nombre_archivo for foto in servicio.fotos]
        }
        for servicio in servicios
    ]
    return jsonify(servicios_data)

@api.route('/api/region_comuna', methods=['GET'])
def obtener_regiones_comunas():
    try:
        regiones = Region.query.all()
        data = []

        for region in regiones:
            comunas = Comuna.query.filter_by(region_id=region.id).all()
            data.append({
                'region_id': region.id,
                'region_nombre': region.nombre,
                'comunas': [{'comuna_id': comuna.id, 'comuna_nombre': comuna.nombre} for comuna in comunas]
            })

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api.route('/api/servicios', methods=['GET'])
def obtener_servicios():
    try:
        # Obtener parámetros de paginación
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        # Consultar servicios con paginación
        servicios = Servicio.query.paginate(page=page, per_page=per_page, error_out=False)
        servicios_data = [
            {
                'id': servicio.id,
                'nombre_servicio': servicio.nombre,
                'dia_hora_inicio': servicio.dia_hora_inicio.strftime('%Y-%m-%d %H:%M'),
                'dia_hora_termino': servicio.dia_hora_termino.strftime('%Y-%m-%d %H:%M') if servicio.dia_hora_termino else None,
                'region': servicio.comuna.region.nombre,
                'comuna': servicio.comuna.nombre,
                'sector': servicio.sector,
                'tipo': servicio.tipos[0].tipo if servicio.tipos else "N/A",
                'fotos_servicio': [foto.nombre_archivo for foto in servicio.fotos]
            }
            for servicio in servicios.items
        ]

        return jsonify({
            'servicios': servicios_data,
            'total': servicios.total,
            'pages': servicios.pages,
            'current_page': servicios.page
        })
    except Exception as e:
        print(f"Error en /api/servicios: {e}")  # Registrar el error en la consola
        return jsonify({'error': str(e)}), 500
    
@api.route('/api/servicio/<int:servicio_id>', methods=['GET'])
def obtener_servicio(servicio_id):
    try:
        servicio = Servicio.query.get_or_404(servicio_id)
        servicio_data = {
            'id': servicio.id,
            'nombre_servicio': servicio.nombre,
            'dia_hora_inicio': servicio.dia_hora_inicio.strftime('%Y-%m-%d %H:%M'),
            'dia_hora_termino': servicio.dia_hora_termino.strftime('%Y-%m-%d %H:%M') if servicio.dia_hora_termino else None,
            'region': servicio.comuna.region.nombre,
            'comuna': servicio.comuna.nombre,
            'sector': servicio.sector,
            'tipo': servicio.tipos[0].tipo if servicio.tipos else "N/A",
            'descripcion': servicio.descripcion,
            'fotos_servicio': [foto.nombre_archivo for foto in servicio.fotos]
        }
        return jsonify(servicio_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api.route('/api/estadisticas/dias')
def estadisticas_dias():
    resultados = (
        Servicio.query
        .with_entities(func.date(Servicio.dia_hora_inicio), func.count(Servicio.id))
        .group_by(func.date(Servicio.dia_hora_inicio))
        .order_by(func.date(Servicio.dia_hora_inicio))
        .all()
    )
    dias = [r[0].strftime('%Y-%m-%d') for r in resultados]
    cantidades = [r[1] for r in resultados]
    return jsonify({'dias': dias, 'cantidades': cantidades})

@api.route('/api/estadisticas/tipos')
def estadisticas_tipos():
    resultados = (
        ServicioTipo.query
        .with_entities(ServicioTipo.tipo, ServicioTipo.glosa_otro, func.count(ServicioTipo.id))
        .group_by(ServicioTipo.tipo, ServicioTipo.glosa_otro)
        .all()
    )
    tipos = []
    cantidades = []
    for tipo, glosa_otro, cantidad in resultados:
        if tipo == "otro" and glosa_otro:
            label = f"otro ({glosa_otro})"
        else:
            label = tipo
        tipos.append(label)
        cantidades.append(cantidad)
    return jsonify({'tipos': tipos, 'cantidades': cantidades})

@api.route('/api/estadisticas/horarios')
def estadisticas_horarios():
    def franja(hora):
        if 6 <= hora < 12:
            return 'manana'
        elif 12 <= hora < 18:
            return 'mediodia'
        else:
            return 'tarde'


    servicios = Servicio.query.all()
    conteo = {}
    meses_set = set()
    for s in servicios:
        mes = s.dia_hora_inicio.strftime('%B')
        meses_set.add(mes)
        hora = s.dia_hora_inicio.hour
        f = franja(hora)
        conteo.setdefault(mes, {'manana': 0, 'mediodia': 0, 'tarde': 0})
        conteo[mes][f] += 1

    meses = sorted(list(meses_set), key=lambda m: datetime.strptime(m, "%B").month)
    manana = [conteo[m].get('manana', 0) for m in meses]
    mediodia = [conteo[m].get('mediodia', 0) for m in meses]
    tarde = [conteo[m].get('tarde', 0) for m in meses]
    return jsonify({'meses': meses, 'manana': manana, 'mediodia': mediodia, 'tarde': tarde})

@api.route('/api/comentarios/<int:servicio_id>', methods=['GET'])
def obtener_comentarios(servicio_id):
    comentarios = Comentario.query.filter_by(servicio_id=servicio_id).order_by(Comentario.fecha.desc()).all()
    data = [
        {
            'nombre': c.nombre,
            'texto': c.texto,
            'fecha': c.fecha.strftime('%Y-%m-%d %H:%M')
        }
        for c in comentarios
    ]
    return jsonify(data)

@api.route('/api/comentarios/<int:servicio_id>', methods=['POST'])
def agregar_comentario(servicio_id):
    data = request.get_json()
    nombre = data.get('nombre', '').strip()
    texto = data.get('texto', '').strip()
    errores = []
    if not (3 <= len(nombre) <= 80):
        errores.append("El nombre debe tener entre 3 y 80 caracteres.")
    if not (len(texto) >= 5):
        errores.append("El comentario debe tener al menos 5 caracteres.")
    if errores:
        return jsonify({'ok': False, 'errores': errores}), 400

    comentario = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=datetime.now(),
        servicio_id=servicio_id
    )
    db.session.add(comentario)
    db.session.commit()
    return jsonify({'ok': True})