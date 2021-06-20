const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World, Again!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
