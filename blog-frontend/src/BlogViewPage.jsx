import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import blogs from "./blogs.json";

export default function BlogViewPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundBlog = blogs.find((b) => b.slug === slug);
    setTimeout(() => {
      setBlog(foundBlog);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Blog Not Found
        </h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">{blog.title}</h1>

        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
          <div>
            <span>
              By{" "}
              <span className="font-medium text-gray-700">
                {blog.author?.fullName}
              </span>
            </span>{" "}
            • {blog.readingTime || "3 min read"}
          </div>
          <div>{new Date(blog.publishedAt).toLocaleDateString()}</div>
        </div>

        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-auto rounded-xl"
          />
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="flex justify-between pt-6">
          <Link to="/" className="text-blue-600 hover:underline text-lg">
            ← Back to Blogs
          </Link>
          {blog.tags && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
