let express = require("express");
global.app = express();
const cors = require("cors");
const { establishRedis } = require("./utility/redisConnect.js");
const { getRoutes } = require("./routes/routes.js");

let bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(cors());
app.use(express.json());
establishRedis();

const dotenv = require("dotenv");
dotenv.config();
const PORT = 3000;

getRoutes();

app.listen(PORT);
console.log("Listening on port 3000");
