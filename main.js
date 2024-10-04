"use strict";
const express = require("express");
const app = express();
const port = 3000;
app.get("/", (req, res) => {
    return res.json({ msg: "tudo ok" });
});
app.listen(port, () => console.log("servidor online!"));
