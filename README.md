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

gRPC:

Existen 3 intentos de conexion gRPC Cliente-Servidor en el codigo, sin embargo, todas fallan por Timeout (el Cliente no encuentra al Servidor). En teoria, de lograrse la conexion, la respuesta a la consulta deberia ser el item del archivo data.json que contiene el valor consultado (1 => "id": 1, "name": "Item 1", "value": 5).
Las rutas de prueba son las siguientes:

```
  http://localhost:3030/items/1?
  http://localhost:3030/test/1?
  http://localhost:3030/lit/1?
```

Frontend:

El front es accesible en la siguiente direccion. Este sirve para facilitar las consultas realizadas al proyecto, guardando los resultados en cache de ser necesario.

```
  http://localhost:3000/api/items
```

Configuracion Redis:

La configuracion del container de Redis se realiza en el archivo docker-compose mediante la siguiente linea, la cual permite ajustar el tamaño de la memoria asignada y el metodo de remocion de las llaves.

```
command: redis-server --bind caching --maxmemory 1mb --maxmemory-policy allkeys-lru
```
Tabla comparativa entre algoritmo de remoción LRU y LFU (i.e., menos recientemente utilizado y menos frecuentemente utilidazo, respectivamente).

| LRU | LFU |
|:---:|:---:|
|Mantiene las *keys* utilizadas más recientemente|Mantiene las *keys* frecuentemente usadas|
|Política muy utilizada cuando se maneja una escala de potencias de la popularidad de las *queries*|Utiliza un contador probabilístico llamado "contador de Morris" para estimar la frecuencia de acceso a las *queries*|
|La versión utilizada por Redis no es exacta. Es decir, al ser consultada por la llave más "lejanamente" utilizada, prueba una pequeña muestra y elimina la mejor de ese grupo|Tiene parámetros ajustables para determinar que tan rápido deja de ser considerada frecuente una *query*|

Breve ejemplo de *allkeys*-LRU y *allkeys*-LFU en esta implementación:

En ambos casos, se consulta inicialmente por "a" múltiples veces:

![afromredis](https://user-images.githubusercontent.com/70279893/166616730-08e40499-cf49-43eb-a90b-b4dcde4ef906.png)

Para el caso de *allkeys*-LRU:

![allkeys-LRU](https://user-images.githubusercontent.com/70279893/166617309-7a6a1997-55ca-4a78-8163-e6c19228f3a5.png)

Una vez se alcanza la memoria máxima (1 megabyte en este caso), se remueve el par *key*-*value* para la *query* que pregunta por "a", a pesar de haber sido consultada múltiples veces:

![BandNAredis](https://user-images.githubusercontent.com/70279893/166617404-1358bcda-b22c-4a45-ac78-dee19294ba6b.png)

Para el caso de *allkeys*-LFU:

![allkeys-LFU](https://user-images.githubusercontent.com/70279893/166617549-6371d74b-09a1-45a6-b337-c619f7fb7b0f.png)

A diferencia del caso anterior, cuando se llena la memoria, el par *key*-*value* eliminado corresponde a la *query* que pregunta por "b", ya que la consulta relacionada a "a" tiene un factor de frecuencia mayor:

![AandBredis](https://user-images.githubusercontent.com/70279893/166617724-6533c2ce-bdb2-45bf-b5e3-2e8425ecc126.png)

BIBLIOGRAFÍA:

Políticas de remoción de Redis:

https://redis.io/docs/manual/eviction/

CODIGOS UTILIZADOS:

Para la conexion y prueba de los modulos gRPC:

https://github.com/Oscurt/sd_202201/tree/main/grpc_example/node

Funcion de espera para conexion a servidor gRPC:

https://www.delftstack.com/es/howto/node.js/nodejs-sleep/

Función para guardar la respuesta de una consulta en redis:

https://www.youtube.com/watch?v=jgpVdJB2sKQ
