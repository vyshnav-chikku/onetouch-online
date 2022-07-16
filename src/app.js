const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "https://onetouch-online.herokuapp.com/",

  // origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());

const AuthRoute = require("./routes/auth");
const getStudentInfo = require("./routes/getStudentInfo");

app.use("/api", AuthRoute);
app.use("/api/student", getStudentInfo);

app.use("/uploads", express.static(path.join("uploads")));

require("./db/conn");

const port = 5000;

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
