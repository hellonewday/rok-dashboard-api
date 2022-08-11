const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 8000;

const reports = require("./routes/reports");
mongoose.connect(
  `mongodb+srv://quochung5c:quochung5c@cluster0-4veva.gcp.mongodb.net/rokboard-vn?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) console.log(error);
    console.log("Connect to database");
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", express.static(__dirname));
app.use("/reports", reports);

app.listen(port, () => console.log(`Listen on port ${port}`));
