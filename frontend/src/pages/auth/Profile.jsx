// src/pages/auth/Profile.jsx

import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { User, Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { ThemeContext } from "../../context/ThemeContext";

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    gender: "",
    date_of_birth: "",
    picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("auth/user/");

      if (res.data) {
        const userData = res.data;
        setForm({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          gender: userData.gender || "",
          date_of_birth: userData.date_of_birth || "",
          picture: null,
        });

        if (userData.picture) {
          setPreview(userData.picture);
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err.response || err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      } else {
        toast.error(err.response?.data?.detail || "Failed to load profile.");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "picture") {
      const file = e.target.files[0];
      setForm({ ...form, picture: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      for (let key in form) {
        if (
          form[key] !== null &&
          form[key] !== undefined &&
          (form[key] !== "" || key === "picture")
        ) {
          data.append(key, form[key]);
        }
      }

      const res = await axios.put("/auth/profile/update/", data);

      if (res.data) {
        toast.success("Profile updated successfully");
        fetchProfile();
      }
    } catch (err) {
      console.error("Profile update error:", err.response || err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      } else {
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          Object.values(err.response?.data || {})[0] ||
          "Failed to update profile";
        toast.error(
          Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - MSK</title>
      </Helmet>

      <div
        className={`min-h-screen flex justify-center items-start px-4 sm:px-6 py-10 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div
          className={`p-6 md:p-8 rounded-2xl w-full max-w-3xl shadow-lg transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2
            className={`text-3xl font-bold text-center mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Update Profile
          </h2>

          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <div
              className={`relative w-28 h-28 rounded-full border-4 shadow-md transition-colors duration-300 ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center rounded-full ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <User
                    className={`w-12 h-12 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  />
                </div>
              )}

              <label
                aria-label="Upload profile picture"
                className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  name="picture"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                loading
                  ? "bg-blue-700 cursor-not-allowed opacity-60"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
