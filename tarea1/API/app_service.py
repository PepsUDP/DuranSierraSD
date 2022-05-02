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
        connection = 0
        #return json.dumps({'Try': "wopsie"});
        try:
            #return json.dumps({'Try': "dentro"});
            connection = psycopg2.connect(user="postgres",
                                    password="marihuana",
                                    host="127.0.0.1",
                                    port="5432",
                                    database="tiendita")
            cursor = connection.cursor()
            return json.dumps({'Try': "conn"});
            postgreSQL_select_Query = "select * from Items"

            cursor.execute(postgreSQL_select_Query)
            mobile_records = cursor.fetchall()

            return json.dumps({'Try': mobile_records});

            print("Print each row and it's columns values")
            for row in mobile_records:
                print("Name = ", row[1], )
                print("Price = ", row[2])
                print("Category  = ", row[3], "\n")

        except (Exception, psycopg2.Error) as error:
            print("Error while fetching data from PostgreSQL", error)

        finally:
            # closing database connection.
            if connection:
                cursor.close()
                connection.close()
                print("PostgreSQL connection is closed")

        return json.dumps({'query_item': request_item});
  