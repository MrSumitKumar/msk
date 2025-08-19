import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "../../api/axios";
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    duration: '',
  });

  useEffect(() => {
    if (isEditing) {
      api.get(`/courses/${id}/`)
        .then(res => {
          setForm({
            title: res.data.title || '',
            description: res.data.description || '',
            price: res.data.price?.toString() || '',
            discount: res.data.discount?.toString() || '',
            duration: res.data.duration?.toString() || '',
          });
        })
        .catch(() => toast.error('Failed to fetch course details'));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/courses/${id}/`, form);
        toast.success('Course updated');
      } else {
        await api.post('/courses/', form);
        toast.success('Course created');
      }
      navigate(`/${user.role}-dashboard`);
    } catch {
      toast.error('Error saving course');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">{isEditing ? 'Edit Course' : 'Add Course'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Course Description"
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          />
          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
            type="number"
            placeholder="Discount (%)"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          />
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            type="number"
            placeholder="Duration (months)"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isEditing ? 'Update Course' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
