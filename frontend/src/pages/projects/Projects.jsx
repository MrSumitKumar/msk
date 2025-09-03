// src/Projects.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ThemeContext } from "../../context/ThemeContext";

const Projects = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [levelFilter, setLevelFilter] = useState("All");

    useEffect(() => {
        // ✅ Projects
        axios
            .get("/projects/projects/")
            .then((res) => {
                if (res.data.results) {
                    setProjects(res.data.results);
                } else if (Array.isArray(res.data)) {
                    setProjects(res.data);
                } else {
                    setProjects([]);
                }
            })
            .catch(() => setProjects([]));

        // ✅ Categories
        axios
            .get("/projects/categories/")
            .then((res) => {
                if (res.data.results) setCategories(res.data.results);
                else if (Array.isArray(res.data)) setCategories(res.data);
            })
            .catch(() => setCategories([]));

        // ✅ Languages
        axios
            .get("/projects/languages/")
            .then((res) => {
                if (res.data.results) setLanguages(res.data.results);
                else if (Array.isArray(res.data)) setLanguages(res.data);
            })
            .catch(() => setLanguages([]));
    }, []);

    const filteredProjects = projects.filter((p) => {
        return (
            (search === "" ||
                p.title.toLowerCase().includes(search.toLowerCase())) &&
            (selectedCategory === "" ||
                p.categories?.some((c) => c.id === Number(selectedCategory))) &&
            (selectedLanguage === "" || p.language?.id === Number(selectedLanguage)) &&
            (levelFilter === "All" || p.level === levelFilter)
        );
    });

    return (
        <div
            className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                            : "bg-white border-gray-300 focus:ring-blue-400"
                        }`}
                />

                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 rounded border w-full"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="p-2 rounded border w-full"
                >
                    <option value="">All Languages</option>
                    {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>

                <select
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="p-2 rounded border w-full"
                >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <p className="text-center text-gray-500">No projects found.</p>
                ) : (
                    filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)} // ✅ Redirect instead of modal
                            className={`cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white px-3 py-1 rounded-full">
                                    {project.level}
                                </span>
                            </div>

                            {/* ✅ Show multiple categories */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {project.categories && project.categories.length > 0 ? (
                                    project.categories.map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="text-xs bg-green-100 dark:bg-green-700 text-green-800 dark:text-white px-2 py-1 rounded-full"
                                        >
                                            {cat.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                        Uncategorized
                                    </span>
                                )}
                            </div>

                            <h2 className="text-lg font-bold mb-2 line-clamp-1">
                                {project.title}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                                {project.description}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;
