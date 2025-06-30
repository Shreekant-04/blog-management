const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
