const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./example.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const Search = grpc.loadPackageDefinition(packageDefinition).Search;
const client = new Search("localhost:50051", grpc.credentials.createInsecure());

module.exports = client;