import React from "react";
import { useNavigate } from "react-router";

import blogs from "./blogs.json";

export default function BlogManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Blogs</h1>
        <button
          onClick={() => navigate("/create")} // Adjust route as per your setup
          className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          + Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-20">
          No blogs found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.slug} // Use slug since _id is not present in your dummy data
              className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
            >
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-700"
                      : blog.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {blog.status}
                </span>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-blog/${blog.slug}`)} // Use slug as id is not in your dummy
                    className="text-gray-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
