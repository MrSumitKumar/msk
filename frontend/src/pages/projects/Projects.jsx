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
    const [loading, setLoading] = useState(false);

    // ✅ Fetch categories & languages once
    useEffect(() => {
        axios.get("/projects/categories/").then((res) => {
            setCategories(res.data.results || res.data);
        });

        axios.get("/projects/languages/").then((res) => {
            setLanguages(res.data.results || res.data);
        });
    }, []);

    // ✅ Fetch projects (with filters applied)
    const fetchProjects = () => {
        setLoading(true);

        let query = [];

        if (search) query.push(`search=${search}`);
        if (selectedCategory) query.push(`categories=${selectedCategory}`);
        if (selectedLanguage) query.push(`languages=${selectedLanguage}`);
        if (levelFilter !== "All") query.push(`level=${levelFilter}`);

        const queryString = query.length ? `?${query.join("&")}` : "";

        axios
            .get(`/projects/projects/${queryString}`)
            .then((res) => {
                if (res.data.results) {
                    setProjects(res.data.results);
                } else if (Array.isArray(res.data)) {
                    setProjects(res.data);
                } else {
                    setProjects([]);
                }
            })
            .catch(() => setProjects([]))
            .finally(() => setLoading(false));
    };

    // ✅ Run whenever filters/search change
    useEffect(() => {
        fetchProjects();
    }, [search, selectedCategory, selectedLanguage, levelFilter]);

    return (
        <div
            className={`min-h-screen py-5 md:px-30 px-5 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >


            {/* Filters */}
            <div
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 ${theme === "dark" ? "text-white" : "text-black"
                    }`}
            >
                {/* Search */}
                <input
                    type="text"
                    placeholder="🔍 Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500"
                            : "bg-white border border-gray-300 placeholder-gray-500 text-black focus:ring-blue-400"
                        }`}
                />

                {/* Category */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`p-2 rounded-lg w-full focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "bg-gray-800 border border-gray-600 text-white focus:ring-green-500"
                            : "bg-white border border-gray-300 text-black focus:ring-green-400"
                        }`}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option
                            key={cat.id}
                            value={cat.id}
                            className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}
                        >
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Language */}
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className={`p-2 rounded-lg w-full focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "bg-gray-800 border border-gray-600 text-white focus:ring-purple-500"
                            : "bg-white border border-gray-300 text-black focus:ring-purple-400"
                        }`}
                >
                    <option value="">All Languages</option>
                    {languages.map((lang) => (
                        <option
                            key={lang.id}
                            value={lang.id}
                            className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}
                        >
                            {lang.name}
                        </option>
                    ))}
                </select>

                {/* Level */}
                <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className={`p-2 rounded-lg w-full focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "bg-gray-800 border border-gray-600 text-white focus:ring-yellow-500"
                            : "bg-white border border-gray-300 text-black focus:ring-yellow-400"
                        }`}
                >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                {/* Reset Button (only if filters are active) */}
                {(selectedCategory || selectedLanguage || levelFilter !== "All") && (
                    <button
                        onClick={() => {
                            setSelectedCategory("");
                            setSelectedLanguage("");
                            setLevelFilter("All");
                        }}
                        className={`px-4 py-2 rounded-lg font-medium shadow transition ${theme === "dark"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                    >
                        Reset Filters ✖
                    </button>
                )}
            </div>



            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-center text-gray-500">No projects found.</p>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className={`cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white px-3 py-1 rounded-full">
                                    {project.level}
                                </span>
                            </div>

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
