import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProjectForm({ project, onSuccess, onCancel, isEdit }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        status: project?.status || 'planning'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let response;
            if (isEdit && project) {
                response = await api.put(`/projects/${project.id}`, formData);
                toast.success('Project updated!');
            } else {
                response = await api.post('/projects', formData);
                toast.success('Project created!');
            }
            onSuccess(response.data);
        } catch (error) {
            toast.error(isEdit ? 'Failed to update project' : 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Project Name *</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            
            <div className="form-group">
                <label>Description</label>
                <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
            
            <div className="form-group">
                <label>Status</label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Project' : 'Create Project')}
                </button>
            </div>
        </form>
    );
}