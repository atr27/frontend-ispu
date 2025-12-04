import React, { useState } from 'react';
import { getISPUColor } from '../utils/colorUtils';

const Sidebar = ({ stations, onStationSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStations = stations.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentDate = new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-area">
                    <div className="title-area">
                        <h1>INDEKS STANDAR</h1>
                        <h1>PENCEMAR UDARA</h1>
                    </div>
                </div>
                <div className="date-display">
                    {currentDate}
                </div>
            </div>

            <div className="station-list-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Cari Lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="station-list">
                    {filteredStations.length === 0 ? (
                        <div className="loading-text" style={{ padding: '20px', color: '#94a3b8' }}>
                            {stations.length === 0 ? 'Memuat data stasiun...' : 'Tidak ada stasiun ditemukan'}
                        </div>
                    ) : (
                        filteredStations.map(station => (
                            <div
                                key={station.id}
                                className="station-item"
                                onClick={() => onStationSelect(station)}
                            >
                                <div className="station-header">
                                    <span className="station-name">{station.name}</span>
                                    <span
                                        className="station-ispu"
                                        style={{ backgroundColor: getISPUColor(station.ispu || 0) }}
                                    >
                                        {station.ispu || 0}
                                    </span>
                                </div>
                                <div className="station-details">
                                    <span>{station.city || '-'}</span>
                                    <span>{station.province || '-'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
