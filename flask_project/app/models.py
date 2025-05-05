from . import db

class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Servicio(db.Model):
    __tablename__ = 'servicio'
    id = db.Column(db.Integer, primary_key=True)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    sector = db.Column(db.String(100))
    nombre = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(15))
    dia_hora_inicio = db.Column(db.DateTime, nullable=False)
    dia_hora_termino = db.Column(db.DateTime)
    descripcion = db.Column(db.String(500))

    comuna = db.relationship('Comuna', backref='servicios')
    fotos = db.relationship('Foto', backref='servicio')
    tipos = db.relationship('ServicioTipo', backref='servicio')

class ServicioTipo(db.Model):
    __tablename__ = 'servicio_tipo'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.Enum('barberia', 'atencion dental', 'atencion kinesiologica', 'peluqueria', 'spa', 'deportes acuaticos', 'turismo', 'entretenimiento', 'restaurante', 'otro'), nullable=False)
    glosa_otro = db.Column(db.String(15))
    servicio_id = db.Column(db.Integer, db.ForeignKey('servicio.id'), nullable=False)

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    servicio_id = db.Column(db.Integer, db.ForeignKey('servicio.id'), nullable=False)