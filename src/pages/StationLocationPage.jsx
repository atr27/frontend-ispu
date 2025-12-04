import React, { useState, useEffect } from 'react';
import APIService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getISPUColor } from '../utils/colorUtils';
import { downloadCSV, formatStationDataForExport } from '../utils/exportUtils';

const StationLocationPage = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch stations with ISPU data from map endpoint
            const response = await APIService.getMapStations();

            if (response.success && response.data) {
                setStations(response.data);
            } else {
                throw new Error('Failed to fetch station data');
            }
        } catch (err) {
            console.error('Error fetching stations:', err);
            setError('Gagal memuat data stasiun. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const formattedData = formatStationDataForExport(filteredStations);
        downloadCSV(formattedData, 'stasiun-pemantauan-ispu');
    };

    const filteredStations = stations.filter(station =>
        station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCurrentDateTime = () => {
        return new Date().toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <LoadingSpinner size="large" message="Memuat data stasiun..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                    <h3 style={styles.errorTitle}>⚠️ Terjadi Kesalahan</h3>
                    <p style={styles.errorMessage}>{error}</p>
                    <button onClick={fetchStations} style={styles.retryButton}>
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Lokasi Stasiun Pemantauan Indeks Standar Pencemar Udara</h2>
                    <p style={styles.subtitle}>{getCurrentDateTime()}</p>
                </div>
                <div style={styles.actions}>
                    <input
                        type="text"
                        placeholder="Cari stasiun, provinsi, atau kota..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button onClick={handleExportCSV} style={styles.exportButton}>
                        📥 Export CSV
                    </button>
                </div>
            </div>

            {filteredStations.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>Tidak ada stasiun yang ditemukan.</p>
                </div>
            ) : (
                <>
                    <div style={styles.statsBar}>
                        <span>Menampilkan {filteredStations.length} dari {stations.length} stasiun</span>
                    </div>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>No</th>
                                    <th style={styles.th}>ID Stasiun</th>
                                    <th style={styles.th}>Nama Stasiun</th>
                                    <th style={styles.th}>Provinsi</th>
                                    <th style={styles.th}>Kota</th>
                                    <th style={styles.th}>Tipe</th>
                                    <th style={styles.th}>Alamat</th>
                                    <th style={styles.th}>Data ISPU</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStations.map((station, index) => (
                                    <tr key={station.id || index} style={styles.tableRow}>
                                        <td style={styles.td}>{index + 1}</td>
                                        <td style={{ ...styles.td, ...styles.boldText }}>
                                            {station.code || station.id || 'N/A'}
                                        </td>
                                        <td style={styles.td}>{station.name || 'N/A'}</td>
                                        <td style={styles.td}>{station.province || 'N/A'}</td>
                                        <td style={styles.td}>{station.city || 'N/A'}</td>
                                        <td style={styles.td}>{station.type || 'KLHK'}</td>
                                        <td style={styles.td}>{station.address || 'Alamat tidak tersedia'}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.ispuBadge,
                                                backgroundColor: getISPUColor(station.ispu || 0)
                                            }}>
                                                {station.ispu || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '80px 20px 20px 20px',
        backgroundColor: '#fff',
        height: '100%',
        overflowY: 'auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
    },
    title: {
        color: '#333',
        margin: 0,
        fontSize: '1.5em',
        fontWeight: '600'
    },
    subtitle: {
        color: '#666',
        fontSize: '0.9em',
        margin: '8px 0 0 0'
    },
    actions: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    searchInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        minWidth: '250px'
    },
    exportButton: {
        padding: '8px 16px',
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    statsBar: {
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
    },
    tableContainer: {
        overflowX: 'auto',
        border: '1px solid #e0e0e0',
        borderRadius: '4px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9em'
    },
    headerRow: {
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6'
    },
    th: {
        padding: '12px',
        textAlign: 'left',
        color: '#333',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },
    tableRow: {
        borderBottom: '1px solid #e0e0e0',
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '12px',
        color: '#555'
    },
    boldText: {
        fontWeight: '600',
        color: '#333'
    },
    ispuBadge: {
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        display: 'inline-block',
        minWidth: '50px',
        textAlign: 'center'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff'
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        padding: '20px'
    },
    errorContent: {
        textAlign: 'center',
        maxWidth: '500px'
    },
    errorTitle: {
        color: '#d32f2f',
        fontSize: '1.5em',
        marginBottom: '16px'
    },
    errorMessage: {
        color: '#666',
        marginBottom: '24px',
        lineHeight: '1.5'
    },
    retryButton: {
        padding: '12px 24px',
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '16px'
    }
};

export default StationLocationPage;

