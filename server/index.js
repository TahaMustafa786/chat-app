const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const MONGO_LOCAL_URI = process.env.MONGO_LOCAL_URI;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users/users");

app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ status: 200, message: "APIs are working" });
});

const connection = mongoose
  .connect(MONGO_LOCAL_URI)
  .then((conn) => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use("/api/v1/users", userRoutes);
