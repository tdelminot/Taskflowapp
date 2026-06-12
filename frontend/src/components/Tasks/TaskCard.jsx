import { useState } from 'react';
import api from '../../services/api';
import TaskDetail from './TaskDetail';
import toast from 'react-hot-toast';

export default function TaskCard({ task, projectId, onUpdate }) {
    const [showDetail, setShowDetail] = useState(false);
    const [updating, setUpdating] = useState(false);

    const getPriorityColor = (priority) => {
        const colors = {
            low: { bg: '#d1fae5', text: '#059669', label: 'Low' },
            medium: { bg: '#fef3c7', text: '#d97706', label: 'Medium' },
            high: { bg: '#fee2e2', text: '#dc2626', label: 'High' },
            urgent: { bg: '#fecaca', text: '#991b1b', label: 'Urgent' }
        };
        return colors[priority] || colors.medium;
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
        setUpdating(true);
        try {
            await api.put(`/tasks/${task.id}`, { status: newStatus });
            toast.success('Task updated');
            onUpdate();
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const priority = getPriorityColor(task.priority);

    return (
        <>
            <div className="task-item" onClick={() => setShowDetail(true)} style={{ cursor: 'pointer' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Priority indicator */}
                    <div style={{
                        width: '8px',
                        height: '40px',
                        background: priority.text,
                        borderRadius: '4px'
                    }} />
                    
                    <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                        {task.description && (
                            <p style={{ fontSize: '0.8rem', color: '#718096' }}>{task.description.substring(0, 80)}</p>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{
                                background: priority.bg,
                                color: priority.text,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '500'
                            }}>
                                {priority.label}
                            </span>
                            <span style={{
                                background: '#e2e8f0',
                                color: '#4a5568',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.7rem'
                            }}>
                                {getStatusLabel(task.status)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div onClick={(e) => e.stopPropagation()}>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </div>
            
            <TaskDetail 
                taskId={task.id}
                projectId={projectId}
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                onUpdate={onUpdate}
            />
        </>
    );
}