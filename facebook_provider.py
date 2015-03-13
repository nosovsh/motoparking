from flask_social_blueprint.providers import BaseProvider, ExternalProfile


class Facebook(BaseProvider):
    def __init__(self, *args, **kwargs):
        defaults = {
            'name': 'Facebook',
            'base_url': 'https://graph.facebook.com/',
            'request_token_url': None,
            'access_token_url': '/oauth/access_token',
            'authorize_url': 'https://www.facebook.com/dialog/oauth',
            'request_token_params': {
                'scope': 'email'
            }
        }
        defaults.update(kwargs)
        super(Facebook, self).__init__(*args, **defaults)

    def get_profile(self, raw_data):
        access_token = raw_data['access_token']
        import facebook

        graph = facebook.GraphAPI(access_token)
        profile = graph.get_object("me")
        profile_id = profile['id']
        data = {
            "provider": "Facebook",
            "profile_id": profile_id,
            "username": profile.get('username'),
            "email": profile.get('email'),
            "access_token": access_token,
            "secret": None,
            "first_name": profile.get('first_name'),
            "last_name": profile.get('last_name'),
            "cn": profile.get('name'),
            "profile_url": "http://facebook.com/profile.php?id={}".format(profile_id),
            "image_url": "http://graph.facebook.com/{}/picture?width=100&height=100".format(profile_id),
            "gender": profile.get("gender")
        }
        return ExternalProfile(profile_id, data, raw_data)

