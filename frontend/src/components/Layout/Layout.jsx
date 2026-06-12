import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <Outlet />
            </main>
            <Toaster position="top-right" />
        </>
    );
}