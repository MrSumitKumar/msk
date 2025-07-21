import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import api from "../api/api";
import { User, Camera } from "lucide-react";

const Profile = () => {
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
      const res = await api.get("/auth/profile/update/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setForm(res.data);
      if (res.data.picture) setPreview(res.data.picture);
    } catch (err) {
      toast.error("Failed to load profile.");
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

    const data = new FormData();
    for (let key in form) {
      if (form[key] !== null) data.append(key, form[key]);
    }

    try {
      await api.put("/auth/profile/update/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully.");
    } catch (err) {
      if (err.response?.data) {
        toast.error("Error: " + JSON.stringify(err.response.data));
      } else {
        toast.error("Error updating profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - MSK Institute</title>
      </Helmet>


<div className="min-h-screen bg-gray-950 text-white flex justify-center items-start px-4 sm:px-6 py-10">
  <div className="bg-gray-900 p-6 md:p-8 rounded-2xl w-full max-w-3xl shadow-lg">
    <h2 className="text-3xl font-bold text-center mb-8">Update Profile</h2>

    {/* Profile Picture */}
    <div className="flex justify-center mb-8">
      <div className="relative w-28 h-28 rounded-full border-4 border-gray-900 shadow-md bg-gray-800">
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-700">
            <User className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* ✅ Camera Label Accessibility Update */}
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
          required // ✅ Added required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required // ✅ Added required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required // ✅ Added required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <select
          name="gender"
          value={form.gender || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
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
