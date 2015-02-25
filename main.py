# -*- coding: utf-8 -*-
import os
from json import dumps
from flask_mail import Mail
from flask import Flask, url_for, render_template, jsonify
from flask.ext.login import current_user
from flask.ext.mongoengine import MongoEngine
from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.resources import Resource
from flask.ext.mongorest import operators as ops
from flask.ext.mongorest import methods
from flask.ext.security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin, login_required
from flask_security.forms import RegisterForm
import wtforms

from pro_resource import ProResource

# config


app = Flask(__name__)
if os.environ.get('PROD_MONGODB'):
    MONGOLAB_URI = os.environ.get('PROD_MONGODB')
    app.config['MONGODB_SETTINGS'] = {
        'db': MONGOLAB_URI[MONGOLAB_URI.rfind("/")+1:],
        'host': MONGOLAB_URI
    }
else:
    app.config['MONGODB_SETTINGS'] = {
        'db': 'motoparking',
        'host': 'mongodb://localhost:27017/motoparking'
    }

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'ytdjf.jk,upo8etsgdf,asdf34ttgewgq3g[q[epqogqjg;'
app.config['SECURITY_REGISTERABLE'] = True

db = MongoEngine(app)
api = MongoRest(app)

# After 'Create app'
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'username'
app.config['MAIL_PASSWORD'] = 'password'
app.config['MAIL_SUPPRESS_SEND'] = True
mail = Mail(app)



# models


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])
    name = db.StringField(max_length=255)


# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)


class ExtendedRegisterForm(RegisterForm):
    name = wtforms.TextField('Name', [wtforms.validators.Required()])


security = Security(app, user_datastore,
         register_form=ExtendedRegisterForm)

# Create a user to test with
# @app.before_first_request
# def create_user():
#     user_datastore.create_user(email='matt@nobien.net', password='123456')


class Parking(db.Document):
    lat_lng = db.PointField()
    is_secure = db.StringField()
    is_moto = db.StringField()
    user = db.ReferenceField(User)

# Parking(title="Парковка 1", lat_lng=[55.7622200, 37.6155600], ).save()


class Opinion(db.Document):
    parking = db.ReferenceField(Parking)
    user = db.ReferenceField(User)
    lat_lng = db.PointField()
    is_secure = db.StringField()
    is_moto = db.StringField()


# resources


class ParkingResource(ProResource):
    document = Parking
    fields = ["id", "lat_lng", "is_secure", "is_moto", "user", "my_opinion", ]
    rename_fields = {
        'lat_lng': 'latLng',
        'is_secure': 'isSecure',
        'is_moto': 'isMoto',
        'my_opinion': 'myOpinion',
    }

    def create_object(self, data=None, save=True, parent_resources=None):
        obj = super(ParkingResource, self).create_object(data, save=False, parent_resources=parent_resources)
        obj.user = current_user._get_current_object()
        if save:
            self._save(obj)
        return obj

    def get_object(self, pk):
        obj = super(ParkingResource, self).get_object(pk=pk)
        opinions = Opinion.objects(parking=obj.pk, user=current_user._get_current_object().pk)
        obj.my_opinion = OpinionResource().serialize(opinions[0]) if opinions else None
        return obj


class OpinionResource(ProResource):
    document = Opinion
    filters = {
        'parkingId': [ops.Exact],
    }
    rename_fields = {
        'parking_id': 'parkingId',
        'lat_lng': 'latLng',
        'is_secure': 'isSecure',
        'is_moto': 'isMoto',
    }
    readonly_fields = ["id", "user"]

    def create_object(self, data=None, save=True, parent_resources=None):
        data = data or self.data
        if "parking" not in data:
            parking = Parking()
            parking.save()
        else:
            parking = Parking.objects.get(pk=data["parking"])

        try:
            opinion = Opinion.objects.get(parking=parking, user=current_user._get_current_object())
        except Opinion.DoesNotExist:
            opinion = Opinion(parking=parking, user=current_user._get_current_object())
        except Opinion.OperationError:
            pass
        opinion = self.update_object(opinion, data, save, parent_resources=parent_resources)

        fill_parking(parking, opinion)
        parking.save()

        return opinion


def fill_parking(parking, opinion):
    parking.is_moto = opinion.is_moto
    parking.is_secure = opinion.is_secure

    if opinion.lat_lng:
        parking.lat_lng = opinion.lat_lng


class UserResource(Resource):
    document = User
    fields = ["id", "name", ]


# api views

@api.register(name='parkings', url='/api/parkings/')
class ParkingView(ResourceView):
    resource = ParkingResource
    methods = [methods.Create, methods.Fetch, methods.List, methods.Delete, methods.Update]


@api.register(name='opinions', url='/api/opinions/')
class OpinionsView(ResourceView):
    resource = OpinionResource
    methods = [methods.Create, methods.Fetch, methods.List, methods.Delete, methods.Update]


@api.register(name='users', url='/api/users/')
class UserView(ResourceView):
    resource = UserResource
    methods = [methods.Fetch, methods.List]


# other views


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """Catch all"""
    return render_template('index.html', current_user_json_str=user_json(current_user))


# utils


def user_json(user):
    return dumps({
        "id": user.get_id()
    })


if __name__ == '__main__':
    app.debug = True
    app.run(
        # host="0.0.0.0"
    )
