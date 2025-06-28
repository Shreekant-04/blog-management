import React, { useState, useEffect } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import axios from "axios";

import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins.pkgd.min.css";
import { useParams } from "react-router";
import blogs from "./blogs.json";

export default function BlogEditorUpdate({ blogId }) {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autosaveMessage, setAutosaveMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    const foundBlog = blogs.find((b) => b.slug === slug);
    setTimeout(() => {
      setBlog(foundBlog);
      setLoading(false);
    }, 500);
  }, [slug]);

  const autoSave = (model) => {
    setAutosaveMessage("Saving draft...");
    setTimeout(() => {
      console.log("Autosaved content:", model);
      setAutosaveMessage("Draft saved");
    }, 800);
  };

  const imageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/api/upload/image", formData)
        .then((response) => resolve(response.data.imageUrl))
        .catch(() => reject("Image upload failed"));
    });
  };

  const config = {
    placeholderText: "Start writing your blog...",
    charCounterCount: true,
    toolbarSticky: true,
    toolbarButtons: [
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "formatUL",
      "formatOL",
      "|",
      "insertImage",
      "insertLink",
      "insertTable",
      "|",
      "html",
      "fullscreen",
    ],
    imageUpload: true,
    imageUploadMethod: "POST",
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    events: {
      contentChanged: function () {
        autoSave(this.html.get());
      },
      "image.beforeUpload": function (files) {
        if (files.length) {
          imageUpload(files[0])
            .then((url) => {
              this.image.insert(url, false, null, this.image.get());
            })
            .catch((err) => {
              alert(err);
            });
        }
        return false;
      },
    },
  };

  const handleUpdate = () => {
    if (!blog.title || !blog.content) {
      alert("Please enter both title and content.");
      return;
    }

    axios
      .put(`/api/blogs/${blogId}`, blog) // Update API
      .then(() => alert("Blog updated successfully!"))
      .catch(() => alert("Something went wrong. Try again."));
  };

  const handleInputChange = (field, value) => {
    setBlog({ ...blog, [field]: value });
  };

  if (loading) return <div className="p-6 text-xl">Loading blog...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Update Blog Post</h1>

        <div>
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full border rounded-xl p-4 text-xl"
            placeholder="Blog Title"
            value={blog.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-lg font-medium mb-2">
            Excerpt (Short Summary)
          </label>
          <input
            id="excerpt"
            type="text"
            className="w-full border rounded-xl p-4 text-xl"
            placeholder="Excerpt"
            value={blog.excerpt}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="featuredImage"
            className="block text-lg font-medium mb-2"
          >
            Featured Image URL
          </label>
          <input
            id="featuredImage"
            type="text"
            className="w-full border rounded-xl p-4 text-xl"
            placeholder="Featured Image URL"
            value={blog.featuredImage}
            onChange={(e) => handleInputChange("featuredImage", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-lg font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            className="w-full border rounded-xl p-4 text-xl"
            placeholder="Tags"
            value={blog.tags.join(", ")}
            onChange={(e) =>
              handleInputChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim())
              )
            }
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-lg font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            className="w-full border rounded-xl p-4 text-xl"
            value={blog.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Blog Content</label>
          <div className="froala-container">
            <FroalaEditorComponent
              tag="textarea"
              model={blog.content}
              onModelChange={(content) => handleInputChange("content", content)}
              config={config}
            />
          </div>
        </div>

        {autosaveMessage && (
          <div className="text-green-600 font-medium">{autosaveMessage}</div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={blog.featured}
            className="cursor-pointer"
            onChange={(e) => handleInputChange("featured", e.target.checked)}
          />
          <label
            htmlFor="featured"
            className="text-lg text-gray-700 cursor-pointer"
          >
            Set as Featured
          </label>
        </div>

        <button
          onClick={handleUpdate}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          Update Blog
        </button>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Preview</h2>
          <div className="border rounded-xl p-6 bg-gray-50 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
