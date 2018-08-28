const express = require("express");

const path = require("path");
process.env["PORT"] = 3000;
let port = process.env.PORT;

let app = express();

app.use(express.static(path.join(__dirname, "src")));
app.listen(port, () => console.log(`listening to port ${port}`));
