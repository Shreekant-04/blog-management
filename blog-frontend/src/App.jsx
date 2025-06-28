import { Routes, Route } from "react-router-dom";
import BlogManagementPage from "./BlogManagementPage";
import BlogEditor from "./BlogEditor";
import BlogEditorUpdate from "./BlogEditorUpdate";
import BlogViewPage from "./BlogViewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogManagementPage />} />
      <Route path="/create" element={<BlogEditor />} />
      <Route path="/update/:slug" element={<BlogEditorUpdate />} />
      <Route path="/blog/:slug" element={<BlogViewPage />} />
    </Routes>
  );
}

export default App;
