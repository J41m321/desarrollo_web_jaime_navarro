from flask import Blueprint, jsonify
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