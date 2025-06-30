const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRouter = require("./routes/upload");
const blogRouter = require("./routes/blogRoutes");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Home routes",
  });
});

app.use("/uploads", uploadRouter);
app.use("/blogs", blogRouter);

module.exports = app;
