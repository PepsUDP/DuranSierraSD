const express = require("express");
const pool = require("./db");
const cors = require('cors');
const redis = require('redis');
const connectRedis =require('connect-redis');
const app = express();


const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./example.proto";
const items = require("./data.json");





const port = 5000;


const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);

const server = () => {
  const server = new grpc.Server();
  server.addService(itemProto.ItemService.service, {
    getItem: (_, callback) => {
      console.log("server query: ", _);
      const itemName = _.request.name;
      const item = items.item_list.filter((obj) => obj.name.includes(itemName));
      callback(null, { items: item});
    }
  });
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC SERVER RUN AT http://localhost:50051");
      server.start();
    }
  });
};

server();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World! GrpcSV here!");
});

// Query BD
// http://localhost:5000/api/itemsbyname/men?
app.get("/api/itemsbyname/:name?", async (req, res) => {
  try {
    var { name } = req.params;
    name = name ?? "";    
    name = '%' + name + '%';
    const itemsByName = await pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [name]);

    // Respuesta BD
    res.json(itemsByName.rows);

  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
