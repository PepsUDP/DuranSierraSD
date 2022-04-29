const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');
const app = express();
const port = process.env.BACKEND_PORT;

app.use(cors());
app.use(express.json());

// const RedisStore =connectRedis(session);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});

// redisClient.on("error", function(error) {
//   console.error(error);
// });

// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'mysecret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000
//   }
// }))

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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

app.get("/api/itemsbyname/:name?", async (req, res) => {
  try {
    var { name } = req.params;
    name = name ?? "";
    const itemsByName = await getOrSetCache(`ìtemsbyname:${name}`, async () => {
      name = '%' + name + '%';
      const getItemsByName = await pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [name]);
      return getItemsByName;
    });
    res.json(itemsByName.rows);
    // redisClient.get(`itemsbyname:${name}`, async (error, items) => {
    //   if (error) console.error(error);
    //   if (items != null) {
    //     console.log("itemsbyname from redis")
    //     return res.json(JSON.parse(items));
    //   } else {
    //     console.log("itemsbyname from db")
    //     const p = name;
    //     name = '%' + name + '%';
    //     const getItemsByName = await pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [name]);
    //     redisClient.setex(`itemsbyname:${p}`, 10, JSON.stringify(getItemsByName));
    //     res.json(getItemsByName.rows);
    //   }
    // });
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