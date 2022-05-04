// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");

// const PROTO_PATH = "./item.proto";
// //const items = require("./data.json");

// const options = {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true,
// };

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
// const itemProto = grpc.loadPackageDefinition(packageDefinition);
// const itemPackage = itemProto.itemPackage;

// const server = () => {
//     const server = new grpc.Server();
//     server.addService(itemPackage.ItemService.service, {

//     });
//     server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(`Server running at: ${port}`);
//             server.start();
//         }
//     });
// };

// // const server = () => {
// //     const server = new grpc.Server();
// //     server.addService(itemProto.ItemService.service, {
// //         getItem: (_, callback) => {
// //             console.log("getItem hit");
// //             // const itemName = _.request.name;
// //             // const item = items.item_list.filter((obj) => obj.name.includes(itemName));
// //             // callback(null, {items: item});
// //         },
// //         getItems: (_, callback) => {
// //             console.log("getItems hit");
// //         }
// //     });
// //     server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
// //         if (err != null) console.log(err);
// //         else {
// //             console.log("GRPC SERVER RUN AT http://localhost:50051");
// //             server.start();
// //         }
// //     });
// // };
// exports.server = server;