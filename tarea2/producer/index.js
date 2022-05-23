const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')
// const request = require("request");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});

const producer = kafka.producer();

app.get("/", async (req, res) => {
    res.send("Hello World! Producer");
});

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});


// the client ID lets kafka know who's producing the messages
const clientId = "producer"
// we can define the list of brokers in the cluster
const brokers = ["0.0.0.0:9092"]
// Declaracion del topic
const topic = "logs"


// // Funcion para escribir en el topic
// const produce = async () => {
// 	await producer.connect()
// 	let i = 0

// 	// after the produce has connected, we start an interval timer
// 	setInterval(async () => {
// 		try {
// 			// send a message to the configured topic with
// 			// the key and value formed from the current value of `i`
// 			await producer.send({
// 				topic,
// 				messages: [
// 					{
// 						key: String(i),
// 						value: "this is message " + i,
// 					},
// 				],
// 			})

// 			// if the message is written successfully, log it and increment `i`
// 			console.log("writes: ", i)
// 			i++
// 		} catch (err) {
// 			console.error("could not write message " + err)
// 		}
// 	}, 1000)
// }
var i = 0
const produce = async (req) => {
	  await producer.connect()
	//   let i = 0
	  const { user, pass } = req.body
	  try {
		i++
	    await producer.send({
	      topic,
	      messages: [
	        { key: user,
			  value: i.toString()
			},
	      ],
	    })
		console.log("writes: ", user, i)
	  } catch (err) {
		  console.error("could not write message " + err)
	  }
}

app.get("/prod", async (req, res) => {
  produce();
});

app.post('/login', async (req, res) => {
	const { user, pass } = req.body;
	// res.send("POST Request Called")
	produce(req);
	res.send('user: ' + user + ' pass: ' + pass);
})

// app.post("/login", async (req, res) => {
// 	  console.log("Test");
// 	  const { user, pass } = req.body;
// 	  const url = "http://localhost:3000/login";
// 	  const options = {
// 		  method: "POST",
// 		  url: url,
// 		  headers: {
// 			  "Content-Type": "application/json",
// 		  },
// 		  body: {
// 			  user: user,
// 			  pass: pass,
// 		  },
// 		};
// });

// request.post(
// 	  "http://localhost:3000/login",
// 	  { json: { user: "admin", pass: "456" } },
// 	  (error, response, body) => {
// 		if (error) {
// 		  return console.log(error);
// 		}
// 		console.log(body);
// 	  }
// );
