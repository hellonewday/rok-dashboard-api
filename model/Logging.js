const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema({
  governor_name: String,
  governor_id: Number,
  power: Number,
  kill_points: Number,
  dead: Number,
  tier_1: Number,
  tier_2: Number,
  tier_3: Number,
  tier_4: Number,
  tier_5: Number,
  rss_assistance: Number,
  alliance: String,
  kingdom: String,
});

module.exports = mongoose.model("logs", logSchema);
