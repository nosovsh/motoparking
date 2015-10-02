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
            "profile_url": "http://facebook.com/{}".format(profile_id),
            "image_url": "http://graph.facebook.com/{}/picture?width=100&height=100".format(profile_id),
            "gender": profile.get("gender")
        }
        return ExternalProfile(profile_id, data, raw_data)


class Google(BaseProvider):
    def __init__(self, *args, **kwargs):
        defaults = {
            'name': 'Google',
            'base_url': 'https://www.google.com/accounts/',
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'access_token_url': 'https://accounts.google.com/o/oauth2/token',
            'request_token_url': None,
            'access_token_method': 'POST',
            'access_token_params': {
                'grant_type': 'authorization_code'
            },
            'request_token_params': {
                'response_type': 'code',
                'scope': 'https://www.googleapis.com/auth/plus.me email'
            }
        }
        defaults.update(kwargs)
        super(Google, self).__init__(*args, **defaults)

    def get_profile(self, raw_data):
        access_token = raw_data['access_token']
        import oauth2client.client as googleoauth
        import apiclient.discovery as googleapi
        import httplib2

        credentials = googleoauth.AccessTokenCredentials(
            access_token=access_token,
            user_agent=''
        )
        http = httplib2.Http()
        http = credentials.authorize(http)
        api = googleapi.build('plus', 'v1', http=http)
        profile = api.people().get(userId='me').execute()
        name = profile.get('name')

        image_url = ""
        if profile.get('image', {}).get("url"):
            image_url = profile.get('image', {}).get("url").replace("sz=50", "sz=100")
        data = {
            'provider': "Google",
            'profile_id': profile['id'],
            'username': None,
            "email": profile.get('emails')[0]["value"],
            'access_token': access_token,
            'secret': None,
            "first_name": name.get("givenName"),
            "last_name": name.get("familyName"),
            'cn': profile.get('displayName'),
            'profile_url': profile.get('url'),
            'image_url': image_url,
            "gender": profile.get("gender")

        }
        return ExternalProfile(str(profile['id']), data, raw_data)
