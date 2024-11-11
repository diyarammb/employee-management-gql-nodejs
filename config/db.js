const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dayadeveloper1948:GgCK5e6VFxHdNdy8@empoyee.kmpze.mongodb.net/?retryWrites=true&w=majority&appName=empoyee",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
