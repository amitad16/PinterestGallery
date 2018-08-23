const express = require("express");

const path = require("path");

let app = express();

app.use(express.static(path.join(__dirname, "src")));
app.listen(3000, () => console.log("listening to port 3000"));
