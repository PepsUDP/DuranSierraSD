# Estructura basada en el tutorial:
# https://medium.com/bb-tutorials-and-thoughts/how-to-dockerize-the-python-rest-api-with-flask-library-d2b51dd4a0ae
# https://github.com/bbachi/python-flask-restapi
# https://pynative.com/python-postgresql-select-data-from-table/

import json
import psycopg2

class AppService:

    params = [
        {"none" : "none"}
    ]

    def __init__(self):
        self.paramsJSON = json.dumps(self.params)

    def get_item(self, request_item):
        ####
        #Consulta Reddis:
        respuesta  = 0
        ####
        #Consulta BD
        if respuesta == 0:
            connection = 0
            #return json.dumps({'Try': "wopsie"});
            try:
                #Se cae la conexion :(
                connection = psycopg2.connect(user="postgres",
                                        password="marihuana",
                                        host="127.0.0.1",
                                        port="6543",
                                        database="tiendita")
                cursor = connection.cursor()
                #return json.dumps({'Try': "conn"});

                #str(request_item)
                postgreSQL_select_Query = "select * from Items"

                cursor.execute(postgreSQL_select_Query)
                mobile_records = cursor.fetchall()

                return json.dumps({'Try': mobile_records});

            except (Exception, psycopg2.Error) as error:
                #return json.dumps({"Error while fetching data from PostgreSQL", str(error)});
                return
            finally:
                # closing database connection.
                if connection:
                    cursor.close()
                    connection.close()

        return json.dumps({'query_item': request_item});
    