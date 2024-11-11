const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  subjects: [String],
  attendance: { type: Map, of: Boolean }
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
