// src/pages/freelancer/ManageProjects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you have an axios instance configured
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectLink: '',
        completedDate: '',
        technologiesUsed: ''
    });
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('https://freelancing-backend-z0fy.onrender.com/api/auth/getUser',{
                    withCredentials: true
                });
                console.log(res.data)
                setProjects(res.data.user.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects.');
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            technologiesUsed: formData.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech !== ''),
            completedDate: formData.completedDate ? new Date(formData.completedDate) : undefined
        };

        try {
            if (editingProject) {
                const res = await axios.put(`https://freelancing-backend-z0fy.onrender.com/api/users/projects/${editingProject._id}`, projectData);
                setProjects(projects.map(p => (p._id === editingProject._id ? res.data.project : p)));
                toast.success('Project updated successfully!');
            } else {
                const res = await axios.post(`https://freelancing-backend-z0fy.onrender.com/api/users/projects`, projectData,{
                   withCredentials: true

                });
                setProjects([...projects, res.data.project]);
                toast.success('Project added successfully!');
            }
            setFormData({
                title: '',
                description: '',
                projectLink: '',   
                completedDate: '',
                technologiesUsed: ''
            });
            setEditingProject(null);
        } catch (error) {
            console.error('Project submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to save project.');
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            projectLink: project.projectLink,
            completedDate: project.completedDate ? new Date(project.completedDate).toISOString().split('T')[0] : '',
            technologiesUsed: project.technologiesUsed.join(', ')
        });
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`/api/users/projects/${projectId}`);
                setProjects(projects.filter(p => p._id !== projectId));
                toast.success('Project deleted successfully!');
            } catch (error) {
                console.error('Project deletion error:', error);
                toast.error(error.response?.data?.message || 'Failed to delete project.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="projectLink" className="block text-gray-700 text-sm font-bold mb-2">Project Link (URL):</label>
                    <input
                        type="url" // Use type="url" for better browser validation
                        id="projectLink"
                        name="projectLink"
                        value={formData.projectLink}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional):</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="completedDate" className="block text-gray-700 text-sm font-bold mb-2">Completion Date (Optional):</label>
                    <input
                        type="date"
                        id="completedDate"
                        name="completedDate"
                        value={formData.completedDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="technologiesUsed" className="block text-gray-700 text-sm font-bold mb-2">Technologies Used (Comma-separated, e.g., React, Node.js, MongoDB):</label>
                    <input
                        type="text"
                        id="technologiesUsed"
                        name="technologiesUsed"
                        value={formData.technologiesUsed}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                    {editingProject && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProject(null);
                                setFormData({ title: '', description: '', projectLink: '', completedDate: '', technologiesUsed: '' });
                            }}
                            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Your Projects</h3>
            {projects.length === 0 ? (
                <p>No projects added yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                            <p className="text-gray-700 mb-2">{project.description}</p>
                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                View Project
                            </a>
                            {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">Tech:</span> {project.technologiesUsed.join(', ')}
                                </p>
                            )}
                             {project.completedDate && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Completed:</span> {new Date(project.completedDate).toLocaleDateString()}
                                </p>
                            )}
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProjects;