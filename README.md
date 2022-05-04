# DuranSierraSD

README


El proyecto fue realizado mediante el uso de Docker, por lo que su uso resulta altamente amigable.

Preparacion:

Una vez descargado/clonado el repositorio y dentro de la carpeta tarea1 se utiliza el siguiente comando:

```
  docker-compose build
```

Esto, creara una serie de imagenes, las cuales forman parte del proyecto y les asignara puertos especificos (dentro de localhost) a cada una de estas con el fin de poder revisar facilmente el funcionamiento de los componentes:

```
  Frontend -p: 3000
  API/Cliente gRPC -p: 3030
  Servidor gRPC -p: 5000
  Postgresql -p: 5432
  Redis -p: 6379
```

Una vez terminado el proceso de construcion del comando docker-compose, para levantar el proyecto se utiliza el siguiente comando:

```
  docker-compose up
```

Notar que, si alguno de los puertos mencionados con anterioridad se encuentra ocupado por algun otro contenedor, este comando arrojara error.

Pruebas:

Existen diversas pruebas que se pueden realizar en este proyecto para comprobar el funcionamiento de los componentes:


Query BD:

Mediante la siguiente ruta, se consulta en el contenedor servidor gRPC sobre los productos que incluyan la palabra [item] en el nombre. Este, le preguntara por los productos al contenedor de Postgresql. 

```
  http://localhost:5000/api/itemsbyname/[item]?
```


Redis:

En primer lugar, se necesita la IP Redis, la cual se obtiene con el siguiente comando:

```
  docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tarea1-caching-1
```

luego:

```
  docker exec -it tarea1-caching-1 sh
  redis-cli -h [IP Redis] -p 6379
```

Esto nos conectara a la instancia de Redit del contenedor tarea1-caching-1. Una vez dentro, utilizamos el siguiente comando para obtener las llaves guardadas:

```
  KEYS '*'
```

Finalmente, con el siguiente comando se pueden obtener los valores guardados para una llave en cuestion:

```
  GET [nombre de alguna llave]
```


CODIGOS UTILIZADOS:

Para la conexion y prueba de los modulos gRPC:

https://github.com/Oscurt/sd_202201/tree/main/grpc_example/node

Funcion de espera para conexion a servidor gRPC:

https://www.delftstack.com/es/howto/node.js/nodejs-sleep/
