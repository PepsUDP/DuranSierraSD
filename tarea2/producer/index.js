const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')

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

var i = 0
const produce = async (req) => {
	  await producer.connect()
	  const { user, pass } = req.body
	  try {
		date = Date.now()
	    await producer.send({
	      topic,
	      messages: [
	        { key: user,
			  value: date.toString()
			},
	      ],
	    })
		console.log("escribe: ", user, date)
	  } catch (err) {
		  console.error("no se pudo escribir el mensaje " + err)
	  }
}

app.get("/index", async (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post('/login', async (req, res) => {
	const { user, pass } = req.body;
	produce(req);
	res.send('user: ' + user);
})