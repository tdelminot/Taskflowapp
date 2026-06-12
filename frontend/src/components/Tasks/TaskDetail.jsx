import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Common/Modal';
import TaskForm from './TaskForm';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import Loading from '../Common/Loading';
import Error from '../Common/Error';
import toast from 'react-hot-toast';
import FileUpload from '../Upload/FileUpload';

export default function TaskDetail({ taskId, projectId, isOpen, onClose, onUpdate }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (isOpen && taskId) {
            fetchTask();
        }
    }, [isOpen, taskId]);

    const fetchTask = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/tasks/${taskId}`);
            setTask(response.data);
        } catch (err) {
            setError('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                toast.success('Task deleted');
                onClose();
                onUpdate();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        fetchTask();
        onUpdate();
        toast.success('Task updated');
    };

    const handleImageUploadSuccess = (files) => {
        fetchTask();
        toast.success('Image added');
    };

    const getPriorityClass = (priority) => {
        const classes = {
            low: 'priority-low',
            medium: 'priority-medium',
            high: 'priority-high',
            urgent: 'priority-urgent'
        };
        return classes[priority] || 'priority-medium';
    };

    const getStatusLabel = (status) => {
        const labels = {
            todo: 'To Do',
            in_progress: 'In Progress',
            review: 'Review',
            done: 'Done'
        };
        return labels[status] || status;
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            toast.success('Status updated');
            fetchTask();
            onUpdate();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
            {loading && <Loading />}
            {error && <Error message={error} />}
            
            {task && (
                <div>
                    {/* Header with title and actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>{task.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-secondary" onClick={() => setShowEditModal(true)}>
                                Edit
                            </button>
                            <button className="btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <p style={{ color: '#718096', marginBottom: '1rem' }}>
                        {task.description || 'No description'}
                    </p>
                    
                    {/* Priority and Status */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span className={`project-status ${getPriorityClass(task.priority)}`}>
                            Priority: {task.priority}
                        </span>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    
                    {/* Due date */}
                    {task.due_date && (
                        <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                    )}
                    
                    <hr style={{ margin: '1rem 0' }} />
                    
                    {/* Display attached images */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Attachments</h4>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {task.attachments.map(attachment => (
                                    <div key={attachment.id} style={{ position: 'relative' }}>
                                        <img
                                            src={`http://localhost:5000${attachment.path}`}
                                            alt={attachment.original_name}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                border: '1px solid #e2e8f0'
                                            }}
                                            onClick={() => window.open(`http://localhost:5000${attachment.path}`, '_blank')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <hr style={{ margin: '1rem 0' }} />
                    
                    {/* Add Image section */}
                    <h4>Add Image</h4>
                    <FileUpload 
                        onUploadSuccess={handleImageUploadSuccess}
                        multiple={false}
                        maxFiles={1}
                    />
                    
                    <hr style={{ margin: '1rem 0' }} />
                    
                    {/* Comments section */}
                    <h4>Comments</h4>
                    <CommentList taskId={taskId} onUpdate={fetchTask} />
                    <CommentForm taskId={taskId} onCommentAdded={fetchTask} />
                </div>
            )}
            
            {/* Edit Task Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task">
                {task && (
                    <TaskForm 
                        projectId={projectId}
                        task={task}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setShowEditModal(false)}
                        isEdit
                    />
                )}
            </Modal>
        </Modal>
    );
}