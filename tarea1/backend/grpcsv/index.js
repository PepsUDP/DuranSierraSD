const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');
const app = express();

const port = 5000;

const grpc = require("./grpc_client");
const server = require("./grpc_server");
server.server();

app.use(cors());
app.use(express.json());




app.get("/", (req, res) => {
  res.send("Hello World! Grpc sv here!");
});

// http://localhost:5000/items/men?
app.get("/items/:item?", async (req, res) => {
  var { item } = req.params;
  if (item) {
    grpc.GetItem({name: item}, (error, items) => {
        if (error){
            console.log(error);
            res.json({});
        } res.json(items);
    })
  }
});

// http://localhost:5000/api/itemsbyname/men?
app.get("/api/itemsbyname/:name?", async (req, res) => {
  try {
    var { name } = req.params;
    name = name ?? "";    
    name = '%' + name + '%';
    const itemsByName = await pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [name]);


    res.json(itemsByName.rows);

  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
