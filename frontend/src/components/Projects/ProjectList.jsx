import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import Pagination from '../Common/Pagination';
import Loading from '../Common/Loading';
import Error from '../Common/Error';
import Modal from '../Common/Modal';

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [page, statusFilter]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 9 };
            if (statusFilter) params.status = statusFilter;
            
            const response = await api.get('/projects', { params });
            setProjects(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
            setTotal(response.data.total || 0);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = (newProject) => {
        setProjects([newProject, ...projects]);
        setShowForm(false);
        if (projects.length >= 9) {
            fetchProjects();
        }
    };

    const handleProjectUpdated = () => {
        fetchProjects();
    };

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1>My Projects ({total})</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        <option value="">All Status</option>
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + New Project
                    </button>
                </div>
            </div>
            
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Project">
                <ProjectForm onSuccess={handleProjectCreated} onCancel={() => setShowForm(false)} />
            </Modal>
            
            {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                    No projects yet. Create your first project!
                </div>
            ) : (
                <>
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onUpdate={handleProjectUpdated}
                            />
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}