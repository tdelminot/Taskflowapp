import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetail from './components/Projects/ProjectDetail';
import Dashboard from './components/Dashboard/Dashboard';

function ProtectedRoute({ children }) {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/projects" />} />
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                
                <Route path="dashboard" element={<Dashboard />} />
<Route index element={<Navigate to="/dashboard" />} />
                
                
                </Route>
            </Routes>
        </Router>
    );
}

export default App;