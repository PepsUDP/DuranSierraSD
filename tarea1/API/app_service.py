# Estructura basada en el tutorial:
# https://medium.com/bb-tutorials-and-thoughts/how-to-dockerize-the-python-rest-api-with-flask-library-d2b51dd4a0ae
# https://github.com/bbachi/python-flask-restapi

import json

class AppService:

    params = [
        {"none" : "none"}
    ]

    def __init__(self):
        self.paramsJSON = json.dumps(self.params)

    def get_item(self, request_item):
        return json.dumps({'query_item': request_item});
  