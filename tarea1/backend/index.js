const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');

// const grpc = require("@grpc/grpc-js");
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

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const ItemService = grpc.loadPackageDefinition(packageDefinition).ItemService;

// https://www.delftstack.com/es/howto/node.js/nodejs-sleep/
const displayFunction = () => {
  const client = new ItemService("0.0.0.0:50051", grpc.credentials.createInsecure());
  console.log("cliente!", client);
}
//function may contain more parameters
setTimeout(displayFunction, 4000);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*

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

*/



// Grpc
// http://localhost:3030/items/men?

app.get("/items/:item?", async (req, res) => {
  var { item } = req.params;
  if (item) {
    console.log("query al sv: ", item);
    grpcc.GetItem({name: item}, (error, items) => {
        console.log("query: previa");
        if (error){
            console.log(error);
            res.json({"fallo": "f"});
        } res.json(items);
    console.log("query: paso");
    })
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
