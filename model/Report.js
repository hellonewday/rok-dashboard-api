const mongoose = require("mongoose");
const Logging = require("./Logging");
const Schema = mongoose.Schema;


const reportSchema = new Schema({
  logs: [{
    type: Schema.Types.ObjectId,
    ref: Logging
  }],
  hour: Number,
  day: Number,
  month: Number,
  year: Number,
});
module.exports = mongoose.model("reports", reportSchema);
