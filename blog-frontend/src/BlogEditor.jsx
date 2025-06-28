import React, { useState, useEffect } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import axios from "axios";

import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins.pkgd.min.css";

export default function BlogEditor({ initialData = {}, onSubmit }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(
    initialData.featuredImage || ""
  );
  const [featured, setFeatured] = useState(initialData.featured || false);
  const [tags, setTags] = useState(
    initialData.tags ? initialData.tags.join(", ") : ""
  );
  const [status, setStatus] = useState(initialData.status || "draft");
  const [autosaveMessage, setAutosaveMessage] = useState("");
  const [imageInputMode, setImageInputMode] = useState("upload");

  useEffect(() => {
    if (
      initialData.featuredImage &&
      !initialData.featuredImage.startsWith("http")
    ) {
      setImageInputMode("upload");
    } else if (initialData.featuredImage) {
      setImageInputMode("url");
    }
  }, [initialData.featuredImage]);

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
        .then((response) => {
          resolve(response.data.imageUrl);
        })
        .catch(() => {
          reject("Image upload failed");
        });
    });
  };

  const handleFeaturedImageUpload = (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/api/upload/image", formData)
      .then((response) => {
        setFeaturedImage(response.data.imageUrl);
      })
      .catch(() => {
        alert("Image upload failed");
      });
  };

  const config = {
    placeholderText: "Start writing your blog...",
    charCounterCount: true,
    toolbarSticky: true,
    useClasses: false, // Forces inline styles
    pluginsEnabled: [
      "align",
      "charCounter",
      "codeView",
      "colors",
      "draggable",
      "emoticons",
      "entities",
      "fontFamily",
      "fontSize",
      "fullscreen",
      "image",
      "inlineStyle",
      "link",
      "lists",
      "paragraphFormat",
      "quickInsert",
      "quote",
      "table",
      "url",
      "video",
      "wordPaste",
    ],
    toolbarButtons: [
      "undo",
      "redo",
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "fontFamily",
      "fontSize",
      "textColor",
      "backgroundColor",
      "paragraphFormat",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "quote",
      "insertLink",
      "insertImage",
      "insertVideo",
      "insertFile",
      "insertTable",
      "emoticons",
      "specialCharacters",
      "insertHR",
      "selectAll",
      "clearFormatting",
      "help",
      "html",
      "fullscreen",
    ],
    paragraphFormat: {
      N: "Normal",
      H1: "Heading 1",
      H2: "Heading 2",
      H3: "Heading 3",
      H4: "Heading 4",
      H5: "Heading 5",
      H6: "Heading 6",
      PRE: "Code",
    },

    imageUpload: true,
    imageUploadMethod: "POST",
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif", "webp"],
    fileUpload: true,
    fileUploadMethod: "POST",
    fileAllowedTypes: ["*"],
    htmlAllowComments: true,
    htmlAllowedEmptyTags: [
      "textarea",
      "a",
      "iframe",
      "object",
      "video",
      "style",
      "script",
    ],
    htmlAllowedTags: [".*"],
    htmlAllowedAttrs: [".*"],
    htmlAllowedStyleProps: [".*"],
    htmlRemoveTags: [],
    quickInsertTags: ["image", "table", "ol", "ul", "hr", "paragraph"],
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
      "file.beforeUpload": function (files) {
        if (files.length) {
          const formData = new FormData();
          formData.append("file", files[0]);

          axios
            .post("/api/upload/file", formData)
            .then((response) => {
              this.file.insert(
                response.data.fileUrl,
                files[0].name,
                null,
                this.file.get()
              );
            })
            .catch(() => {
              alert("File upload failed");
            });
        }
        return false;
      },

      "commands.after": function (cmd, val) {
        const styleMap = {
          H1: "font-size:2.25rem;font-weight:700;color:#1f2937;",
          H2: "font-size:1.875rem;font-weight:600;color:#374151;",
          H3: "font-size:1.5rem;font-weight:600;color:#4b5563;",
          H4: "font-size:1.25rem;font-weight:500;color:#6b7280;",
          H5: "font-size:1.125rem;font-weight:500;color:#6b7280;",
          H6: "font-size:1rem;font-weight:500;color:#6b7280;",
        };

        this.format.apply(val);

        const selectedElement = this.selection.element();
        if (selectedElement && styleMap[val]) {
          selectedElement.setAttribute("style", styleMap[val]);
        }
      },
    },
  };

  const handleSubmit = () => {
    if (!title || !content) {
      alert("Please enter both title and content.");
      return;
    }

    const blogData = {
      title,
      content,
      excerpt,
      featuredImage,
      featured,
      tags: tags.split(",").map((tag) => tag.trim()),
      status,
    };

    onSubmit(blogData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Blog Editor</h1>

        <input
          type="text"
          className="w-full border rounded-xl p-4 text-xl"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded-xl p-4 text-xl"
          placeholder="Excerpt (Short Summary)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Featured Image
          </label>
          <div className="flex items-center mb-4 space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="imageInputMode"
                value="upload"
                checked={imageInputMode === "upload"}
                onChange={() => setImageInputMode("upload")}
              />
              <span>Upload Image</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="imageInputMode"
                value="url"
                checked={imageInputMode === "url"}
                onChange={() => setImageInputMode("url")}
              />
              <span>Image URL</span>
            </label>
          </div>

          {imageInputMode === "upload" && (
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFeaturedImageUpload(e.target.files[0])}
              />
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          )}

          {imageInputMode === "url" && (
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="w-full border rounded-xl p-4 text-xl"
                placeholder="Enter image URL"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
              />
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          className="w-full border rounded-xl p-4 text-xl"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <select
          className="w-full border rounded-xl p-4 text-xl"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <div className="froala-container">
          <FroalaEditorComponent
            tag="textarea"
            model={content}
            onModelChange={setContent}
            config={config}
          />
        </div>

        {autosaveMessage && (
          <div className="text-green-600 font-medium">{autosaveMessage}</div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            className="cursor-pointer"
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label
            htmlFor="featured"
            className="text-lg text-gray-700 cursor-pointer"
          >
            Set as Featured
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          {initialData._id ? "Update Blog" : "Publish Blog"}
        </button>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Preview</h2>
          <div
            className="border rounded-xl p-6 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
