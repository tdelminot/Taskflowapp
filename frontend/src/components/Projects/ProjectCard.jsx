import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../Common/Modal';
import ProjectForm from './ProjectForm';
import toast from 'react-hot-toast';

export default function ProjectCard({ project, onUpdate }) {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);

    const getStatusClass = (status) => {
        const classes = {
            planning: 'status-planning',
            active: 'status-active',
            completed: 'status-completed',
            archived: 'status-archived'
        };
        return classes[status] || 'status-planning';
    };

    const getStatusLabel = (status) => {
        const labels = {
            planning: 'Planning',
            active: 'Active',
            completed: 'Completed',
            archived: 'Archived'
        };
        return labels[status] || status;
    };

    const getProgressColor = (progress) => {
        if (progress < 30) return '#ef4444';
        if (progress < 70) return '#ed8936';
        return '#48bb78';
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete project "${project.name}"? All tasks will be deleted.`)) {
            try {
                await api.delete(`/projects/${project.id}`);
                toast.success('Project deleted');
                onUpdate();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    return (
        <>
            <div className="card project-card" style={{ cursor: 'pointer', overflow: 'hidden' }}>
                <div onClick={() => navigate(`/projects/${project.id}`)}>
                    {/* Progress bar at top */}
                    <div style={{
                        height: '4px',
                        background: '#e2e8f0',
                        margin: '-1.5rem -1.5rem 1rem -1.5rem'
                    }}>
                        <div style={{
                            width: `${project.progress}%`,
                            height: '100%',
                            background: getProgressColor(project.progress),
                            transition: 'width 0.3s'
                        }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{project.name}</h3>
                        <span className={`project-status ${getStatusClass(project.status)}`}>
                            {getStatusLabel(project.status)}
                        </span>
                    </div>
                    
                    <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.9rem', minHeight: '60px' }}>
                        {project.description || 'No description provided.'}
                    </p>
                    
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '0.25rem' }}>
                            Progress • {project.progress}%
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <button className="btn-secondary" onClick={handleEdit} style={{ padding: '0.25rem 0.75rem' }}>
                        Edit
                    </button>
                    <button className="btn-danger" onClick={handleDelete} style={{ padding: '0.25rem 0.75rem' }}>
                        Delete
                    </button>
                </div>
            </div>
            
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Project">
                <ProjectForm 
                    project={project} 
                    onSuccess={() => { setShowEditModal(false); onUpdate(); toast.success('Project updated'); }} 
                    onCancel={() => setShowEditModal(false)} 
                    isEdit
                />
            </Modal>
        </>
    );
}