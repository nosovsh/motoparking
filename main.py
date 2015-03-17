# -*- coding: utf-8 -*-
import os
from datetime import datetime
from json import dumps
from flask_mail import Mail
from flask import Flask, url_for, render_template, jsonify, request
from flask.ext.login import current_user
# from flask.ext.social import Social
# from flask.ext.social.datastore import MongoEngineConnectionDatastore
from flask.ext.mongoengine import MongoEngine
from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.resources import Resource
from flask.ext.mongorest import operators as ops
from flask.ext.mongorest import methods
from flask.ext.mongorest.authentication import AuthenticationBase
from flask.ext.security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin, login_required, user_registered
import flask_social_blueprint
from flask_social_blueprint.core import SocialBlueprint
from flask_security.utils import do_flash


from pro_resource import ProResource
from mongo_fields import SwappedPointField

# config


app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'motoparking',
    'host': 'mongodb://localhost:27017/motoparking'
}
app.config['DEBUG'] = True

app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'ytdjf.jk,upo8etsgdf,asdf34ttgewgq3g[q[epqogqjg;'
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_MSG_LOGIN'] = (u'Вы не авторизованы или Вас нет в списках доступа.', 'info')

if os.environ.get('PROD_MONGODB'):
    MONGOLAB_URI = os.environ.get('PROD_MONGODB')
    app.config['MONGODB_SETTINGS'] = {
        'db': MONGOLAB_URI[MONGOLAB_URI.rfind("/")+1:],
        'host': MONGOLAB_URI
    }
    app.config['DEBUG'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SECURITY_PASSWORD_SALT'] = os.environ.get('SECURITY_PASSWORD_SALT')
# app.config['SECURITY_LOGIN_USER_TEMPLATE'] = "login.html"

# app.config['SOCIAL_FACEBOOK'] = {
#     'consumer_key': '1556008511346406',
#     'consumer_secret': 'a2ed924ccd3e3cf15a392b23fdb37f25'  # TODO: change and move out
# }

# Flask-SocialBlueprint
# https://github.com/wooyek/flask-social-blueprint
app.config['SOCIAL_BLUEPRINT'] = {
    # https://developers.facebook.com/apps/
    "facebook_provider.Facebook": {
        # App ID
        'consumer_key': '1556008511346406',
        # App Secret
        'consumer_secret': 'a2ed924ccd3e3cf15a392b23fdb37f25'
    },
}

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


class SessionAuthentication(AuthenticationBase):
    def authorized(self):
        return current_user.is_authenticated()


class BaseResourceView(ResourceView):
    authentication_methods = [SessionAuthentication, ]


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
    first_name = db.StringField(max_length=255)
    last_name = db.StringField(max_length=255)
    image = db.StringField(max_length=255)
    gender = db.StringField(max_length=255)
    invite_code = db.StringField(max_length=255)
    weight = db.FloatField(default=0.3)

    @property
    def cn(self):
        if not self.first_name or not self.last_name:
            return self.email
        return u"{} {}".format(self.first_name, self.last_name)

    @property
    def id(self):
        return self.pk

    @classmethod
    def by_email(cls, email):
        return cls.objects(email=email).first()


class Invite(db.Document):
    code = db.StringField(max_length=255)


class SocialConnection(db.Document):
    user = db.ReferenceField(User)
    provider = db.StringField(max_length=255)
    profile_id = db.StringField(max_length=255)
    username = db.StringField(max_length=255)
    email = db.StringField(max_length=255)
    access_token = db.StringField(max_length=255)
    secret = db.StringField(max_length=255)
    first_name = db.StringField(max_length=255, help_text=u"First Name")
    last_name = db.StringField(max_length=255, help_text=u"Last Name")
    name = db.StringField(max_length=255, help_text=u"Common Name")
    profile_url = db.StringField(max_length=512)
    image_url = db.StringField(max_length=512)

    def get_user(self):
        return self.user

    @classmethod
    def by_profile(cls, profile):
        provider = profile.data["provider"]
        return cls.objects(provider=provider, profile_id=profile.id).first()

    @classmethod
    def from_profile(cls, user, profile):

        invite_code = request.cookies.get("invite")
        invite = Invite.objects(code=invite_code).first()
        user_with_invite = User.objects(invite_code=invite_code).first()
        if invite:
            if user_with_invite:
                raise Exception(u"Этот инвайт уже использован, напиши нам – дадим новый!")
        else:
            raise Exception(u"Нужен инвайт, что бы зайти на сайт. Напиши нам – сразу дадим!")

        if not user or user.is_anonymous():
            email = profile.data.get("email")
            if not email:
                msg = "Cannot create new user, authentication provider did not not provide email"
                # logging.warning(msg)
                print msg
                raise Exception(msg)
            conflict = User.objects(email=email).first()
            if conflict:
                msg = "Cannot create new user, email {} is already used. Login and then connect external profile."
                msg = msg.format(email)
                # logging.warning(msg)
                print msg
                raise Exception(msg)

            now = datetime.now()
            gender = None
            if profile.data.get("gender") == "male":
                gender = "m"
            if profile.data.get("gender") == "female":
                gender = "f"

            user = User(
                email=email,
                first_name=profile.data.get("first_name"),
                last_name=profile.data.get("last_name"),
                confirmed_at=now,
                image=profile.data.get("image_url"),
                gender=gender,
                invite_code=invite_code
            )
            user.save()

        connection = cls(user=user, **profile.data)
        connection.save()
        return connection

    def __unicode__(self):
        return u"SocialConnection for {}".format(self.email)

    meta = {
        'collection': 'socialconnection',
        'indexes': ['user', 'profile_id'],
    }


# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)


# class ExtendedRegisterForm(RegisterForm):
#     name = wtforms.TextField('Name', [wtforms.validators.Required()])


security = Security(app, user_datastore)
         # register_form=ExtendedRegisterForm)


SocialBlueprint.init_bp(app, SocialConnection, url_prefix="/_social")


@user_registered.connect_via(app)
def when_template_rendered(*args, **kwargs):
    user = kwargs['user']
    user.active = False
    user.save()


class Parking(db.Document):
    lat_lng = SwappedPointField()
    is_secure = db.StringField(default="yes")
    is_moto = db.StringField(default="maybe")
    price_per_day = db.IntField()
    price_per_month = db.IntField()
    user = db.ReferenceField(User)
    created = db.DateTimeField()
    updated = db.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.created:
            self.created = datetime.now()
        self.updated = datetime.now()
        return super(Parking, self).save(*args, **kwargs)

    def calculate(self):
        opinions = Opinion.objects(parking=self.pk, is_secure__exists=True, is_secure__ne="maybe").select_related(1)
        is_secure = {
            "yes": 0,
            "no": 0,
        }
        for opinion in opinions:
            is_secure[opinion.is_secure] += opinion.user.weight

        if is_secure["yes"] == is_secure["no"]:
            self.is_secure = "maybe"
        else:
            self.is_secure = max(is_secure.items(), key=lambda x: x[1])[0]

        if self.is_secure == "yes":
            is_moto = {
                "yes": 0,
                "no": 0,
            }
            for opinion in opinions:
                if opinion.is_moto != "maybe":
                    is_moto[opinion.is_moto] += opinion.user.weight

            if is_moto["yes"] == is_moto["no"]:
                self.is_moto = "maybe"
            else:
                self.is_moto = max(is_moto.items(), key=lambda x: x[1])[0]
        else:
            self.is_moto = "maybe"

Parking(lat_lng={"type": "Point", "coordinates": [1,2]}, __auto_convert=False).save()



class Opinion(db.Document):
    parking = db.ReferenceField(Parking)
    user = db.ReferenceField(User)
    lat_lng = SwappedPointField()
    is_secure = db.StringField()
    is_moto = db.StringField(default="maybe")
    price_per_day = db.IntField()
    price_per_month = db.IntField()
    created = db.DateTimeField()
    updated = db.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.created:
            self.created = datetime.now()
        self.updated = datetime.now()
        return super(Opinion, self).save(*args, **kwargs)


# resources

class UserResource(Resource):
    document = User
    fields = ["id", "first_name", "last_name", "image", "gender", ]


class ParkingResource(ProResource):
    document = Parking
    fields = ["id", "lat_lng", "is_secure", "is_moto", "user", "my_opinion", "price_per_day", "price_per_month",
              "users", "created", "updated"]
    rename_fields = {
        'lat_lng': 'latLng',
        'is_secure': 'isSecure',
        'is_moto': 'isMoto',
        'my_opinion': 'myOpinion',
        'price_per_day': 'pricePerDay',
        'price_per_month': 'pricePerMonth'
    }

    def create_object(self, data=None, save=True, parent_resources=None):
        obj = super(ParkingResource, self).create_object(data, save=False, parent_resources=parent_resources)
        obj.user = current_user._get_current_object()
        if save:
            self._save(obj)
        return obj

    def get_object(self, pk):
        obj = super(ParkingResource, self).get_object(pk=pk)
        my_opinions = Opinion.objects(parking=obj.pk, user=current_user._get_current_object().pk)
        obj.my_opinion = OpinionResource().serialize(my_opinions[0]) if my_opinions else None
        opinions = Opinion.objects(parking=obj.pk, is_secure__in=("yes", "no")).order_by("updated")
        users = [opinion.user for opinion in opinions]
        obj.users = [UserResource().serialize(user) for user in users]
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
        'price_per_day': 'pricePerDay',
        'price_per_month': 'pricePerMonth'
    }
    readonly_fields = ["id", "user"]
    related_resources = {
        "user": UserResource
    }

    def create_object(self, data=None, save=True, parent_resources=None):
        data = data or self.data
        if "parking" not in data:
            parking = Parking()
            parking.save()
            data["is_secure"] = "yes"
        else:
            parking = Parking.objects.get(pk=data["parking"])

        try:
            opinion = Opinion.objects.get(parking=parking, user=current_user._get_current_object())
        except Opinion.DoesNotExist:
            opinion = Opinion(parking=parking, user=current_user._get_current_object())
        except Opinion.OperationError:
            pass

        if data.get("is_secure") != "yes":
            data["is_moto"] = "maybe"
        if data.get("is_moto") != "yes":
            data["price_per_day"] = None
            data["price_per_month"] = None
        opinion = self.update_object(opinion, data, save, parent_resources=parent_resources)

        fill_parking(parking, opinion)
        parking.calculate()
        parking.save()

        return opinion


def fill_parking(parking, opinion):
    parking.is_moto = opinion.is_moto
    parking.is_secure = opinion.is_secure
    parking.price_per_day = opinion.price_per_day
    parking.price_per_month = opinion.price_per_month

    if opinion.lat_lng:
        parking.lat_lng = opinion.lat_lng




# api views

@api.register(name='users', url='/api/users/')
class UserView(BaseResourceView):
    resource = UserResource
    methods = [methods.Fetch, methods.List, methods.Update]


@api.register(name='parkings', url='/api/parkings/')
class ParkingView(BaseResourceView):
    resource = ParkingResource
    methods = [methods.Create, methods.Fetch, methods.List, methods.Delete, methods.Update]


@api.register(name='opinions', url='/api/opinions/')
class OpinionsView(BaseResourceView):
    resource = OpinionResource
    methods = [methods.Create, methods.Fetch, methods.List, methods.Delete, methods.Update]


# import auth.views
# app.register_blueprint(auth.views.app, url_prefix='/pages')


# Enable i18n and l10n
from flask_babel import Babel
babel = Babel(app)

# other views

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@login_required
def catch_all(path):
    """Catch all"""
    return render_template('index.html',
                           current_user_json_str=current_user_json(current_user),
                           debug=app.config['DEBUG'])


# utils


def current_user_json(user):
    return dumps({
        "id": user.get_id(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "image": user.image,
        "email": user.email,
        "gender": user.gender,
    })


if __name__ == '__main__':
    app.debug = True
    app.run(
        # host="0.0.0.0"
    )
