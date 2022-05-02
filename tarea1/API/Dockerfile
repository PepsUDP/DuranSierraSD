# Basado en el tutorial:
# https://medium.com/bb-tutorials-and-thoughts/how-to-dockerize-the-python-rest-api-with-flask-library-d2b51dd4a0ae
# https://github.com/bbachi/python-flask-restapi
# docker build -t api . 
# docker run -d -p 5000:5000 api

FROM python:3.7.13-alpine3.14

COPY . .

RUN pip install psycopg2-binary
RUN pip install --no-cache-dir -r requirements-prod.txt


EXPOSE 5000

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"] 
