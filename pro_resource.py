import mongoengine
from bson.dbref import DBRef
from mongoengine.fields import EmbeddedDocumentField, ListField, ReferenceField

from flask.ext.mongorest.resources import Resource


class ProResource(Resource):
    def serialize(self, obj, params=None):
        if not obj:
            return {}

        if obj.__class__ in self._child_document_resources \
        and self._child_document_resources[obj.__class__] != self.__class__:
            return obj and self._child_document_resources[obj.__class__]().serialize(obj)

        def get(obj, field_name, field_instance=None):
            """
            @TODO needs significant cleanup
            """
            field_value = obj if field_instance else getattr(obj, field_name, None)
            field_instance = field_instance or getattr(self.document, field_name, None)
            if isinstance(field_instance, (ReferenceField, EmbeddedDocumentField)):
                if field_name in self._related_resources:
                    return field_value and self._related_resources[field_name]().serialize(field_value)
                else:
                    if isinstance(field_value, DBRef):
                        return field_value
                    return field_value and field_value.to_dbref()
            elif isinstance(field_instance, ListField):
                return [get(elem, field_name, field_instance=field_instance.field) for elem in field_value]
            elif callable(field_instance):
                value = field_value()
                if field_name in self._related_resources:
                    if isinstance(value, mongoengine.queryset.QuerySet):
                        return [self._related_resources[field_name]().serialize(o) for o in value]
                return value
            return field_value

        fields = self.get_fields()

        if params and '_fields' in params:
            only_fields = set(params['_fields'].split(','))
        else:
            only_fields = None

        data = {}
        for field in fields:
            renamed_field = self._rename_fields.get(field, field)
            if only_fields != None and renamed_field not in only_fields:
                continue
            if hasattr(self, field):
                data[renamed_field] = getattr(self, field)(obj)
            else:
                data[renamed_field] = get(obj, field)

        return data
