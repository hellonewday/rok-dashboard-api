const mongoose = require("mongoose");
const Report = require("./Report");
const Schema = mongoose.Schema;

const executionSchema = new Schema(
  {
    execution_time: Number,
    status: String,
    report: Report,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
module.exports = mongoose.model("Executions", executionSchema);
