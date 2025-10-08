// src/pages/projects/ProjectDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ThemeContext } from "../../context/ThemeContext";
import MarkdownRenderer from "../../components/MarkdownRenderer";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [project, setProject] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get(`/projects/projects/${id}/`).then(async (res) => {
      setProject(res.data);

      // Fetch markdown content from GitHub raw link
      if (res.data.link) {
        const rawUrl = res.data.link
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
        const r = await fetch(rawUrl);
        setContent(await r.text());
      }
    });
  }, [id]);

  if (!project) return <p className="p-6">Loading...</p>;

  return (
    <div
      className={`min-h-screen py-10 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button (Top) */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          ← Back to Projects
        </button>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-lg p-8 transition ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* ✅ FIXED: render level.name instead of object */}
            {project.level && (
              <span className="px-4 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-white">
                {project.level?.name || "No Level"}
              </span>
            )}

            {project.categories?.map((cat) => (
              <span
                key={cat.id}
                className="px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-white"
              >
                {cat.name}
              </span>
            ))}

            {project.languages?.map((lang) => (
              <span
                key={lang.id}
                className="px-4 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white"
              >
                {lang.name}
              </span>
            ))}
          </div>

          {/* Markdown */}
          <MarkdownRenderer content={content} />
        </div>

        {/* Back Button (Bottom) */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/projects")}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
