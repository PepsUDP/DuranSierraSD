const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');

const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./example.proto";

const app = express();

const port = process.env.BACKEND_PORT;

const grpc = require("@grpc/grpc-js");
const grpcc = require("./grpc_client");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

app.use(cors());
app.use(express.json());

// const RedisStore =connectRedis(session);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});





app.get("/", (req, res) => {
  res.send("Hello World!");
});


// *************
// Grpc
//**************


// http://localhost:3030/items/1?

app.get("/items/:item?", async (req, res) => {
  var { item } = req.params;
  if (item) {
    console.log("query al sv: ", item);
    grpcc.GetItem({name: item}, (error, items) => {
        console.log("query: previa");
        if (error){
            console.log(error);
            res.json({"fallo": "f"});
            return;
        } res.json(items);
        return;
    // console.log("query: paso");
    })
  }
});

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const ItemService = grpc.loadPackageDefinition(packageDefinition).ItemService;


// http://localhost:3030/test/1?
app.get("/test/:item?", async (req, res) => {
  var { item } = req.params;
  response = caller(item);
  res.json(response);
  return;
});

function caller(item){
  var client = new ItemService('0.0.0.0:4500',
                                       grpc.credentials.createInsecure());
  client.GetItem({name: item}, function(err, response) {
    console.log('Greeting: ', response);
    if (err){
      console.log(err);
      response = {"fallo": "f"};
      return response;
    }
  return response;
  });
}

// http://localhost:3030/lit/1?
app.get("/lit/:item?", async (req, res) => {
  var { item } = req.params;
  if (item) {
    var client = new ItemService('0.0.0.0:4500',
                                       grpc.credentials.createInsecure());
    console.log("query al sv: ", item);
    client.GetItem({name: item}, (error, items) => {
        console.log("query: lit");
        if (error){
            console.log(error);
            res.json({"fallo": "f"});
            return;
        } res.json(items);
        return;
    // console.log("query: paso");
    })
  }
});



// ******************
// Conexion BD y API
// ******************

app.get("/api/items", async (req, res) => {
  try {
    const items = await getOrSetCache("items", async () => {
      const getItems = await pool.query("SELECT * FROM items");
      return getItems;
    });
    res.json(items.rows);
  } catch (error) {
    console.log(error);
  }
});


// BD
app.get("/query/:name?", async (req, res) => {
  try {
    var { name } = req.params;
    name = name ?? "";
    const itemsByName = await getOrSetCache(`itemsbyname:${name}`, async () => {
      name = '%' + name + '%';
      const getItemsByName = await pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [name]);
      return getItemsByName;
    });
    res.json(itemsByName.rows);
  } catch (error) {
    console.log(error);
  }
});
  
function getOrSetCache(key, callback) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data != null) {
        console.log(`${key} from redis`);
        return resolve(JSON.parse(data));
      }
      const freshData = await callback();
      redisClient.set(key, JSON.stringify(freshData));
      resolve (freshData);
    });
  });
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
