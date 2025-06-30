const upload = require("../config/multer");
const Blog = require("../models/blogModle");

const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createBlog = catchAsync(async (req, res, next) => {
  const {
    title,
    content,
    excerpt,
    featured,
    author,
    tags,
    status,
    publishedAt,
    featuredImage,
    seo,
  } = req.body;

  // Validate required fields
  if (!title || !content || !author) {
    return next(new AppError("Title, content, and author are required", 400));
  }

  let rawfeaturedImage = null;
  if (req.file) {
    // Assuming you're storing the file and serving from a public folder
    featuredImage = `http://localhost:3001/uploads/${req.file.filename}`; // or the full URL if required
  }

  // Create new blog post document
  const newBlogPost = new Blog({
    title,
    content,
    excerpt,
    featured,
    author,
    tags: JSON.parse(tags),
    status,
    publishedAt,
    seo,
    featuredImage: rawfeaturedImage ? rawfeaturedImage : featuredImage || "",
  });

  // Save to DB
  const savedPost = await newBlogPost.save();

  res.status(201).json({
    message: "Blog post created successfully",
    blog: savedPost,
  });
});
router.post("/", upload.single("featuredImage"), createBlog);

module.exports = router;
