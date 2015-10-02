from bson import DBRef, ObjectId, SON

from mongoengine.fields import PointField


class SwappedPointField(PointField):
    """[lat, lng] in code. [lng, lat] in mongo.

    pass __auto_convert=False if creating from python."""
    def to_mongo(self, value):
        if isinstance(value, dict):
            return {
                "type": self._type,
                "coordinates": list(reversed(value["coordinates"]))
            }
        return SON([("type", self._type), ("coordinates", list(reversed(value)))])

    def to_python(self, value):
        """TODO: value can be list"""
        return super(SwappedPointField, self).to_python({
            "type": self._type,
            "coordinates": list(reversed(value["coordinates"]))
        })
