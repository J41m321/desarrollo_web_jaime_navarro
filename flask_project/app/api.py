from flask import Blueprint, jsonify, request
from .models import Servicio, Region, Comuna

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