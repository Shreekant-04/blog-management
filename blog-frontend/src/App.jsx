import { Routes, Route } from "react-router-dom";
import BlogManagementPage from "./BlogManagementPage";
import BlogEditor from "./BlogEditor";
import BlogViewPage from "./BlogViewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogManagementPage />} />
      <Route path="/create" element={<BlogEditor />} />
      <Route path="/edit-blog/:slug" element={<BlogEditor />} />
      <Route path="/blogs/:slug" element={<BlogViewPage />} />
    </Routes>
  );
}

export default App;
