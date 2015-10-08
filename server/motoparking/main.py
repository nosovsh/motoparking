# -*- coding: utf-8 -*-
###########################################################################
#
# Backend of this service was writen at the maximum speed so it is not a masterpiece.
# A lot of refactoring coming soon.
#
###########################################################################

import os
from datetime import datetime, timedelta
from json import dumps
import sys
import logging

from flask_mail import Mail
from flask import Flask, render_template, request
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
    UserMixin, RoleMixin, user_registered
from flask_social_blueprint.core import SocialBlueprint
from flask.sessions import SecureCookieSessionInterface
import random
import string
from werkzeug.utils import redirect
from flask_security.utils import do_flash

from pro_resource import ProResource
from mongo_fields import SwappedPointField

# config


app = Flask(__name__)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

app.config['MONGODB_SETTINGS'] = {
    'db': 'motoparking',
    'host': 'mongodb://localhost:27017/motoparking'
}
app.config['DEBUG'] = False

app.config['SECRET_KEY'] = 'super-secret'
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'ytdjf.jk,upo8etsgdf,asdf34ttgewgq3g[q[epqogqjg;'
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_MSG_LOGIN'] = (u'Вы не авторизованы или Вас нет в списках доступа.', 'info')

if os.environ.get('MONGODB_DB'):
    app.config['MONGODB_SETTINGS'] = {
        'db': os.environ.get('MONGODB_DB'),
        'host': os.environ.get('PROD_MONGODB')
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
    "providers.Facebook": {
        # App ID
        'consumer_key': '1556008511346406',
        # App Secret
        'consumer_secret': 'a2ed924ccd3e3cf15a392b23fdb37f25'
    },
    # https://console.developers.google.com/project
    "providers.Google": {
        # Client ID
        'consumer_key': '697498708815-abuhifg72qng38ur8mtnhin9347tcmep.apps.googleusercontent.com',
        # Client secret
        'consumer_secret': 'uSVAvnfTBwlF4fwHZV9LJ24a'
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


def session_authentication_fabric(methods):
    class MethodSessionAuthentication(AuthenticationBase):
        auth_methods = methods
        def authorized(self):
            if request.method in self.auth_methods:
                return current_user.is_authenticated()
            return True
    return MethodSessionAuthentication


class InfiniteSecureCookieSessionInterface(SecureCookieSessionInterface):
    """Longer session"""
    def get_expiration_time(self, app1, session):
        session.permanent = True
        return super(InfiniteSecureCookieSessionInterface, self).get_expiration_time(app1, session)

app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=90)
app.session_interface = InfiniteSecureCookieSessionInterface()


class BaseResourceView(ResourceView):
    authentication_methods = [session_authentication_fabric(["POST", "UPDATE", "DELETE"]), ]


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
    tracking_id = db.StringField(max_length=255)
    is_super = db.BooleanField(default=False)

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

    def save(self, *args, **kwargs):
        if not self.tracking_id:
            def id_generator(size=24, chars=string.ascii_lowercase + string.digits):
                return ''.join(random.choice(chars) for _ in range(size))
            self.tracking_id = id_generator()

        return super(User, self).save(*args, **kwargs)


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
        if not user or user.is_anonymous():
            email = profile.data.get("email")
            if not email:
                msg = "Cannot create new user, authentication provider did not not provide email"
                # logging.warning(msg)
                print msg
                raise Exception(msg)
            conflict = User.objects(email=email).first()
            if conflict:
                msg = u"Упс. Кажется этот емэйл ({}) уже зарегистрирован через другую социальную сеть." \
                      u" Попробуйте нажать на другую кнопку."
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


class ExtendedSocialBlueprint(SocialBlueprint):
    def no_connection(self, profile, provider):
        try:
            connection = self.create_connection(profile, provider)
        except Exception as ex:
            logging.warn(ex, exc_info=True)
            do_flash(ex.message, "warning")
            return self.login_failed_redirect(profile, provider)

        return self.login_connection(connection, profile, provider)

    def login_failed_redirect(self, profile, provider):
        return redirect("/login")

    @classmethod
    def create_bp(cls, name, connection_adapter, providers, *args, **kwargs):
        bp = ExtendedSocialBlueprint(name, __name__, connection_adapter, providers, *args, **kwargs)
        bp.route('/login/<provider>', endpoint="login")(bp.authenticate)
        bp.route('/callback/<provider>', endpoint="callback")(bp.callback)
        return bp

ExtendedSocialBlueprint.init_bp(app, SocialConnection, url_prefix="/_social")


@user_registered.connect_via(app)
def when_template_rendered(*args, **kwargs):
    user = kwargs['user']
    user.active = False
    user.save()


class Parking(db.Document):
    lat_lng = SwappedPointField()
    address = db.StringField()
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


class ParkingImage(db.Document):
    parking = db.ReferenceField(Parking, required=True)
    user = db.ReferenceField(User, required=True)
    cloudinary_id = db.StringField(required=True)
    created = db.DateTimeField()
    updated = db.DateTimeField()
    is_deleted = db.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.created:
            self.created = datetime.now()
        self.updated = datetime.now()
        return super(ParkingImage, self).save(*args, **kwargs)

    meta = {
        'ordering': ['-created']
    }


class Opinion(db.Document):
    parking = db.ReferenceField(Parking)
    user = db.ReferenceField(User)
    lat_lng = SwappedPointField()
    address = db.StringField()
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


class Comment(db.Document):
    parking = db.ReferenceField(Parking)
    user = db.ReferenceField(User)
    text = db.StringField()
    created = db.DateTimeField()
    updated = db.DateTimeField()
    is_deleted = db.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.created:
            self.created = datetime.now()
        self.updated = datetime.now()
        return super(Comment, self).save(*args, **kwargs)

    meta = {
        'ordering': ['-created']
    }


# resources


class UserResource(ProResource):
    document = User
    fields = ["id", "first_name", "last_name", "image", "gender", "social_connections", "opinions", "stats"]
    rename_fields = {
        "first_name": "firstName",
        "last_name": "lastName",
        "social_connections": "socialConnections",
    }

    def get_object(self, pk):
        obj = super(UserResource, self).get_object(pk=pk)
        social_connections = SocialConnection.objects(user=pk)
        obj.social_connections = [{"provider": sc.provider, "profileUrl": sc.profile_url} for sc in social_connections]
        opinions = Opinion.objects(user=pk).order_by("-updated")
        obj.opinions = [OpinionResource().serialize(o, {"_fields": "id,parking,isSecure,isMoto,updated,pricePerDay,pricePerMonth"}) for o in opinions]
        obj.stats = {}
        obj.stats["opinionsCount"] = len(obj.opinions)
        obj.stats["parkingsCount"] = Parking.objects(user=pk).count()
        obj.stats["commentsCount"] = Comment.objects(user=pk).count()
        obj.stats["parkingImagesCount"] = ParkingImage.objects(user=pk).count()
        return obj

class ParkingResource(ProResource):
    document = Parking
    fields = ["id", "lat_lng", "address", "is_secure", "is_moto", "user", "my_opinion", "price_per_day", "price_per_month",
              "users", "comments", "created", "updated", "parking_images", ]
    rename_fields = {
        'lat_lng': 'latLng',
        'is_secure': 'isSecure',
        'is_moto': 'isMoto',
        'my_opinion': 'myOpinion',
        'price_per_day': 'pricePerDay',
        'price_per_month': 'pricePerMonth',
        'parking_images': 'parkingImages'
    }
    allowed_ordering = ["created", "updated", "id", ]

    def create_object(self, data=None, save=True, parent_resources=None):
        obj = super(ParkingResource, self).create_object(data, save=False, parent_resources=parent_resources)
        obj.user = current_user._get_current_object()
        if save:
            self._save(obj)
        return obj

    def get_object(self, pk):
        obj = super(ParkingResource, self).get_object(pk=pk)
        if current_user.is_authenticated():
            my_opinions = Opinion.objects(parking=obj.pk, user=current_user._get_current_object().pk)
            obj.my_opinion = OpinionResource().serialize(my_opinions[0]) if my_opinions else None
        else:
            obj.my_opinion = None
        opinions = Opinion.objects(parking=obj.pk, is_secure__in=("yes", "no")).order_by("updated")
        users = [opinion.user for opinion in opinions]
        obj.users = [UserResource().serialize(user) for user in users]
        comments = Comment.objects(parking=obj.pk, is_deleted=False)
        obj.comments = [CommentResource().serialize(comment) for comment in comments]
        parking_images = ParkingImage.objects(parking=obj.pk, is_deleted=False)
        obj.parking_images = [ParkingImageResource().serialize(parking_image) for parking_image in parking_images]
        return obj

    def delete_object(self, obj, parent_resources=None):
        # Really delete from db
        if current_user.is_super:
            Opinion.objects(parking=obj.pk).delete()
            Comment.objects(parking=obj.pk).delete()
            ParkingImage.objects(parking=obj.pk).delete()
            obj.delete()


class OpinionResource(ProResource):
    document = Opinion
    filters = {
        'parking': [ops.Exact],
    }
    rename_fields = {
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
    allowed_ordering = ["created", "updated", "id", ]

    def create_object(self, data=None, save=True, parent_resources=None):
        data = data or self.data
        if "parking" not in data:
            parking = Parking(user=current_user._get_current_object())
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

        # fix parking with no author
        if not parking.user:
            parking.user = current_user._get_current_object()

        # only author can change lat_lng
        if current_user.id != parking.user.id:
            data["lat_lng"] = None

        opinion = self.update_object(opinion, data, save, parent_resources=parent_resources)

        self.fill_parking(parking, opinion)

        if opinion.address:
            opinion.address = None
            opinion.save()

        parking.calculate()
        parking.save()

        return opinion

    def fill_parking(self, parking, opinion):
        parking.is_moto = opinion.is_moto
        parking.is_secure = opinion.is_secure
        parking.price_per_day = opinion.price_per_day
        parking.price_per_month = opinion.price_per_month
        if opinion.address is not None:
            parking.address = opinion.address

        if opinion.lat_lng:
            parking.lat_lng = opinion.lat_lng


class CommentResource(ProResource):
    document = Comment
    filters = {
        'parking': [ops.Exact],
    }
    rename_fields = {
    }
    fields = ["id", "tempId", "user", "parking", "text", "created", "updated", ]
    readonly_fields = ["id", "user", "parking", "created", "updated", ]
    related_resources = {
        "user": UserResource,
        "parking": ParkingResource
    }
    allowed_ordering = ["created", "updated", "id", ]

    def create_object(self, data=None, save=True, parent_resources=None):
        data = data or self.data
        comment = super(CommentResource, self).create_object(data, False, parent_resources)
        comment.user = current_user._get_current_object()
        parking = Parking.objects.get_or_404(id=data["parking"])
        comment.parking = parking
        if save:
            self._save(comment)
        return comment

    def tempId(self, d):
        return self.data.get("tempId")


class ParkingImageResource(ProResource):
    document = ParkingImage
    filters = {
        'parking': [ops.Exact],
    }
    rename_fields = {
        "cloudinary_id": "cloudinaryId"
    }
    fields = ["id", "tempId", "user", "parking", "cloudinary_id", "created", "updated", ]
    readonly_fields = ["id", "user", "parking", "created", "updated", ]
    related_resources = {
        "user": UserResource,
        "parking": ParkingResource
    }
    allowed_ordering = ["created", "updated", "id", ]

    def create_object(self, data=None, save=True, parent_resources=None):
        data = data or self.data
        parking_image = super(ParkingImageResource, self).create_object(data, False, parent_resources)
        parking_image.user = current_user._get_current_object()
        parking = Parking.objects.get_or_404(id=data["parking"])
        parking_image.parking = parking
        if save:
            self._save(parking_image)
        return parking_image

    def tempId(self, d):
        return self.data.get("tempId")


# api views


@api.register(name='users', url='/api/users/')
class UserView(BaseResourceView):
    resource = UserResource
    methods = [methods.Fetch, methods.List, ]


@api.register(name='parkings', url='/api/parkings/')
class ParkingView(BaseResourceView):
    resource = ParkingResource
    methods = [methods.Fetch, methods.List, methods.Delete]


@api.register(name='opinions', url='/api/opinions/')
class OpinionsView(BaseResourceView):
    resource = OpinionResource
    methods = [methods.Create, methods.Fetch, methods.List, ]

@api.register(name='comments', url='/api/comments/')
class CommentView(BaseResourceView):
    resource = CommentResource
    methods = [methods.Create, methods.Fetch, methods.List, ]

@api.register(name='parking_images', url='/api/parking_images/')
class ParkingImagesView(BaseResourceView):
    resource = ParkingImageResource
    methods = [methods.Create, methods.Fetch, methods.List, ]


# import auth.views
# app.register_blueprint(auth.views.app, url_prefix='/pages')


# Enable i18n and l10n
from flask_babel import Babel
babel = Babel(app)

# other views

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """Catch all"""
    return render_template('index.html',
                           current_user_json_str=current_user_json(current_user),
                           debug=app.config['DEBUG'])


# utils


def current_user_json(user):
    if user.is_anonymous():
        return dumps({})
    else:
        if not user.tracking_id:  # force generate tracking id
            user.save()
        return dumps({
            "id": user.get_id(),
            "firstName": user.first_name,
            "lastName": user.last_name,
            "image": user.image,
            "email": user.email,
            "gender": user.gender,
            "trackingId": user.tracking_id,
            "isSuper": user.is_super
        })


if __name__ == '__main__':
    # app.debug = True
    app.run(
        host="0.0.0.0"
    )
