import React, { useState, useEffect } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import axios from "axios";

import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins.pkgd.min.css";
import { Eye, X } from "lucide-react";

// Register custom dropdown (only once)
if (window.FroalaEditor && !window.FroalaEditor._listStyleDropdownAdded) {
  window.FroalaEditor._listStyleDropdownAdded = true;

  window.FroalaEditor.RegisterCommand("listStyleDropdown", {
    title: "Numbering Style",
    type: "dropdown",
    options: {
      decimal: "1. 2. 3.",
      "lower-alpha": "a. b. c.",
      "upper-alpha": "A. B. C.",
      "lower-roman": "i. ii. iii.",
      "upper-roman": "I. II. III.",
    },
    callback: function (cmd, val) {
      const blocks = this.selection.blocks();
      blocks.forEach((block) => {
        let ol =
          block.tagName.toLowerCase() === "ol"
            ? block
            : block.querySelector("ol");
        if (ol) {
          ol.setAttribute("style", `list-style-type: ${val};`);
        }
      });
    },
    refresh: function () {},
  });
}

const ScrollLock = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return null;
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // console.log("Autosaved content:", model);
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

  const config = {
    placeholderText: "Start writing your blog...",
    height: 500,
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
        console.log(val); 
        console.log(cmd); 
        const styleMap = {
          H1: "font-size:2.25rem;font-weight:700;color:#1f2937;",
          H2: "font-size:1.875rem;font-weight:600;color:#374151;",
          H3: "font-size:1.5rem;font-weight:600;color:#4b5563;",
          H4: "font-size:1.25rem;font-weight:500;color:#6b7280;",
          H5: "font-size:1.125rem;font-weight:500;color:#6b7280;",
          H6: "font-size:1rem;font-weight:500;color:#6b7280;",
          N: "font-size:1rem;font-weight:400;color:#111827;",
          PRE: "font-family:monospace;background:#f3f4f6;padding:0.5rem;border-radius:0.25rem;",
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

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
    }
  };

  return (
    <>
      {isModalOpen && <ScrollLock />}
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Blog Editor
            </h1>
            <Eye
              size={20}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2  hover:text-blue-800 transition text-lg cursor-pointer"
            />
          </div>

          {/* Blog Title */}
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl p-4 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Excerpt */}
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Excerpt (Short Summary)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          {/* Featured Image Section */}
          <div className="space-y-4">
            <label className="block text-xl font-semibold text-gray-700">
              Featured Image
            </label>

            <div className="flex items-center space-x-6">
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
              <div className="flex flex-col items-start justify-center   space-x-6 ">
                <label
                  htmlFor="imageupload"
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="imageupload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}

            {imageInputMode === "url" && (
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>
            )}
          </div>

          {featuredImage && (
            <div className="relative group">
              <img
                src={featuredImage}
                alt="Featured"
                className="w-auto h-auto object-cover rounded-xl shadow-lg border"
              />
              <X
                size={24}
                onClick={() => setFeaturedImage("")}
                className="cursor-pointer absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full hover:bg-red-700 transition"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-8">
            {/* Tags */}
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col w-full sm:w-52">
              <label className="text-lg font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Froala Editor */}
          <div className="froala-container border border-gray-300 rounded-xl overflow-hidden">
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

          {/* Featured Checkbox */}
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

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl shadow hover:bg-blue-700 transition"
          >
            {initialData._id ? "Update Blog" : "Publish Blog"}
          </button>
        </div>

        {/* Preview Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-10 max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Blog Preview
              </h2>
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="mb-6 w-full h-auto object-fit rounded-xl shadow-lg"
                />
              )}
              <p>{excerpt}</p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
