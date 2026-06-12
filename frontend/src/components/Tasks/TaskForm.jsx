import { useState } from 'react';
import api from '../../services/api';
import FileUpload from '../Upload/FileUpload';
import toast from 'react-hot-toast';

export default function TaskForm({ projectId, task, onSuccess, onCancel, isEdit }) {
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        status: task?.status || 'todo',
        due_date: task?.due_date?.split('T')[0] || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let response;
            if (isEdit && task) {
                response = await api.put(`/tasks/${task.id}`, formData);
                toast.success('Task updated!');
            } else {
                response = await api.post(`/projects/${projectId}/tasks`, formData);
                toast.success('Task created!');
            }
            
            // If images were uploaded, we can associate them with the task
            if (uploadedImages.length > 0 && response.data.id) {
                // TODO: Associate images with task (backend endpoint needed)
                console.log('Images to associate:', uploadedImages);
            }
            
            onSuccess(response.data);
        } catch (error) {
            toast.error(isEdit ? 'Failed to update task' : 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (files) => {
        setUploadedImages(prev => [...prev, ...files]);
        toast.success(`${files.length} image(s) uploaded`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title *</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label>Priority</label>
                <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>Status</label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
            </div>
            
            {!isEdit && (
                <div className="form-group">
                    <label>Attach Images</label>
                    <FileUpload 
                        onUploadSuccess={handleUploadSuccess}
                        multiple={true}
                        maxFiles={5}
                    />
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Task' : 'Create Task')}
                </button>
            </div>
        </form>
    );
}