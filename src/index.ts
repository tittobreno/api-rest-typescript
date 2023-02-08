import express from "express";
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
