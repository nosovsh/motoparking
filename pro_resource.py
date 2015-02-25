import mongoengine
from bson.dbref import DBRef
from mongoengine.fields import EmbeddedDocumentField, ListField, ReferenceField

from flask.ext.mongorest.resources import Resource


class ProResource(Resource):
    pass
