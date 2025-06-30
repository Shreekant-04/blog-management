const mongoose = require("mongoose");
const { JSDOM } = require("jsdom");

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    featuredImage: { type: String },
    featured: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    views: { type: Number, default: 0 },
    readingTime: { type: String },
  },
  { timestamps: true }
);

const blogPopulationOptions = [
  {
    path: "author",
    select: "fullName -_id",
  },
];

function autoPopulateBlog(next) {
  this.populate(blogPopulationOptions);
  next();
}

blogPostSchema.pre(/^find/, autoPopulateBlog);

// calculate reading time before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("content") && this.content) {
    const dom = new JSDOM(this.content);
    const text = dom.window.document.body.textContent || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    this.readingTime = `${minutes} min read`;
  }
  next();
});

// slugify on save
blogPostSchema.pre("save", function (next) {
  this.slug = slugify(this.title);

  next();
});
// slugify on update
blogPostSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title);
    this.setUpdate(update);
  }
  next();
});
// to update featured
blogPostSchema.pre("save", async function (next) {
  if (!this.isModified("featured") || !this.featured) return next();

  await this.constructor.updateMany(
    { _id: { $ne: this._id } },
    { $set: { featured: false } }
  );

  next();
});

module.exports = mongoose.model("Blog", blogPostSchema);
