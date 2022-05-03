const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');

// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");

// const PROTO_PATH = "./example.proto";

const app = express();

const port = process.env.BACKEND_PORT;

const grpc = require("./grpc_client");



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
  console.log("query: ", item);
  if (item) {
    console.log("query al sv: ", item);
    grpc.GetItem({name: item}, (error, items) => {
        if (error){
            console.log(error);
            res.json({});
        } res.json(items);
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
