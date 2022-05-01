# Estructura basada en el tutorial:
# https://medium.com/bb-tutorials-and-thoughts/how-to-dockerize-the-python-rest-api-with-flask-library-d2b51dd4a0ae
# https://github.com/bbachi/python-flask-restapi

from flask import Flask, request
from app_service import AppService
import json

app = Flask(__name__)
appService = AppService();


@app.route('/')
def home():
    return "App Works!!!"

# http://localhost:5000/search?item=task1
@app.route('/search')
def get_item():
    item = request.args.get('item', default = '*', type = str)
    return appService.get_item(item)