import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../Common/Loading';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const projectsRes = await api.get('/projects?page=1&limit=5');
            const projects = projectsRes.data.data || [];
            
            setRecentProjects(projects);
            
            // Calculer les stats
            const totalProjects = projectsRes.data.total || 0;
            const activeProjects = projects.filter(p => p.status === 'active').length;
            const completedProjects = projects.filter(p => p.status === 'completed').length;
            
            // Récupérer les tâches récentes (à adapter selon ton backend)
            let totalTasks = 0;
            let completedTasks = 0;
            
            for (const project of projects) {
                const projectRes = await api.get(`/projects/${project.id}`);
                if (projectRes.data.stats) {
                    totalTasks += projectRes.data.stats.totalTasks || 0;
                    completedTasks += projectRes.data.stats.done || 0;
                }
            }
            
            setStats({
                totalProjects,
                activeProjects,
                completedProjects,
                totalTasks,
                completedTasks,
                progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            });
            
            setRecentTasks([
                { id: 1, title: 'Exemple de tâche', project: 'Projet exemple', status: 'in_progress', priority: 'high' }
            ]);
        } catch (error) {
            console.error('Failed to load dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: '#718096' }}>Welcome back! Here's what's happening with your projects.</p>
            </div>
            
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #667eea' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>{stats.totalProjects}</div>
                    <div style={{ color: '#718096' }}>Total Projects</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #48bb78' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#48bb78' }}>{stats.activeProjects}</div>
                    <div style={{ color: '#718096' }}>Active Projects</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #4299e1' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4299e1' }}>{stats.totalTasks}</div>
                    <div style={{ color: '#718096' }}>Total Tasks</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #ed8936' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ed8936' }}>{stats.completedTasks}</div>
                    <div style={{ color: '#718096' }}>Completed Tasks</div>
                </div>
            </div>
            
            {/* Progress Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Overall Progress</h3>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${stats.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        transition: 'width 0.5s'
                    }} />
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'right', color: '#718096' }}>
                    {stats.progress}% Complete
                </div>
            </div>
            
            {/* Two columns */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Recent Projects */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Recent Projects</h3>
                        <Link to="/projects" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
                            View All →
                        </Link>
                    </div>
                    {recentProjects.length === 0 ? (
                        <p style={{ color: '#718096' }}>No projects yet.</p>
                    ) : (
                        recentProjects.map(project => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                style={{
                                    display: 'block',
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontWeight: '500', color: '#2d3748' }}>{project.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                                    {project.status} • Progress: {project.progress}%
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                
                {/* Recent Activity */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                    <div style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                        Activity feed coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
}