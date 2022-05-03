const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./example.proto";
const items = require("./data.json");
const pool = require("./db");

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
  //Aqui va la query a la BD
  //Falta hacerla sincrona
  //Leyendo el archivo, sirve
  server.addService(itemProto.Search.service, {
    getItem: (_, callback) => {
      const itemName = _.request.name;
      //const item = items.item_list.filter((obj) => obj.name.includes(itemName));
      const item = pool.query("SELECT * FROM items WHERE LOWER ( name ) LIKE $1", [itemName]);

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

exports.server = server;