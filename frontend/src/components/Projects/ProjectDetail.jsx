import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TaskList from '../Tasks/TaskList';
import TaskForm from '../Tasks/TaskForm';
import Modal from '../Common/Modal';
import ProjectForm from './ProjectForm';
import Loading from '../Common/Loading';
import Error from '../Common/Error';
import toast from 'react-hot-toast';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${id}`);
            setProject(response.data);
        } catch (err) {
            setError('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this project? All tasks will be deleted.')) {
            try {
                await api.delete(`/projects/${id}`);
                toast.success('Project deleted');
                navigate('/projects');
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleTaskCreated = (newTask) => {
        setProject(prev => ({
            ...prev,
            tasks: [newTask, ...(prev.tasks || [])]
        }));
        setShowTaskForm(false);
        fetchProject();
    };

    const handleProjectUpdated = () => {
        setShowEditModal(false);
        fetchProject();
        toast.success('Project updated');
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

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;
    if (!project) return <Error message="Project not found" />;

    return (
        <div>
            {/* Back button */}
            <div style={{ marginBottom: '1rem' }}>
                <button className="btn-secondary" onClick={() => navigate('/projects')}>
                    ← Back to Projects
                </button>
            </div>
            
            {/* Nouveau header avec gradient */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
                        <p style={{ opacity: 0.9 }}>{project.description || 'No description provided.'}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                                Status: {getStatusLabel(project.status)}
                            </span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                                Progress: {project.progress}%
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn-secondary" 
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }} 
                            onClick={() => setShowEditModal(true)}
                        >
                            Edit Project
                        </button>
                        <button 
                            className="btn-danger" 
                            style={{ background: 'rgba(239,68,68,0.8)' }} 
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Stats cards */}
            {project.stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{project.stats.totalTasks || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>Total Tasks</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fef3c7' }}>{project.stats.todo || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>To Do</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dbeafe' }}>{project.stats.inProgress || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>In Progress</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d1fae5' }}>{project.stats.done || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>Completed</div>
                    </div>
                </div>
            )}
            
            {/* Tasks section */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Tasks</h2>
                    <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
                        {showTaskForm ? 'Cancel' : '+ Add Task'}
                    </button>
                </div>
                
                {showTaskForm && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <TaskForm projectId={id} onSuccess={handleTaskCreated} onCancel={() => setShowTaskForm(false)} />
                    </div>
                )}
                
                <TaskList projectId={id} tasks={project.tasks || []} onUpdate={fetchProject} />
            </div>
            
            {/* Modal d'édition */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Project">
                <ProjectForm 
                    project={project} 
                    onSuccess={handleProjectUpdated} 
                    onCancel={() => setShowEditModal(false)} 
                    isEdit
                />
            </Modal>
        </div>
    );
}