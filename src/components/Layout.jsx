import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../index.css';

const Layout = ({ stations, onStationSelect }) => {
    const location = useLocation();

    return (
        <div className="app-container">
            <Sidebar stations={stations} onStationSelect={onStationSelect} />

            <main className="main-content">
                <header className="top-bar">
                    <nav className="nav-links">
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>BERANDA</Link>
                        <Link to="/stasiun" className={location.pathname === '/stasiun' ? 'active' : ''}>LOKASI STASIUN</Link>
                    </nav>
                </header>

                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
