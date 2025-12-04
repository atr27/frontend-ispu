/**
 * Export Utility
 * Functions for exporting data to various formats
 */

/**
 * Convert array of objects to CSV string
 * @param {array} data - Array of objects to convert
 * @param {array} headers - Optional custom headers
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, headers = null) => {
    if (!data || data.length === 0) {
        return '';
    }

    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);

    // Create header row
    const headerRow = csvHeaders.join(',');

    // Create data rows
    const dataRows = data.map(row => {
        return csvHeaders.map(header => {
            const value = row[header];

            // Handle null/undefined
            if (value === null || value === undefined) {
                return '';
            }

            // Handle strings with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }

            return value;
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Download data as CSV file
 * @param {array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {array} headers - Optional custom headers
 */
export const downloadCSV = (data, filename = 'export', headers = null) => {
    const csv = convertToCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Download data as JSON file
 * @param {any} data - Data to export
 * @param {string} filename - Name of the file (without extension)
 */
export const downloadJSON = (data, filename = 'export') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Format station data for export
 * @param {array} stations - Array of station objects
 * @returns {array} Formatted data for export
 */
export const formatStationDataForExport = (stations) => {
    return stations.map((station, index) => ({
        'No': index + 1,
        'ID Stasiun': station.code || station.id || 'N/A',
        'Nama': station.name || 'N/A',
        'Provinsi': station.province || 'N/A',
        'Kota': station.city || 'N/A',
        'Alamat': station.address || 'N/A',
        'Tipe': station.type || 'N/A',
        'ISPU': station.ispu || 0,
        'Kategori': station.category || 'N/A',
        'Latitude': station.latitude || 0,
        'Longitude': station.longitude || 0,
        'Status': station.is_active ? 'Aktif' : 'Tidak Aktif'
    }));
};

/**
 * Format air quality data for export
 * @param {array} data - Array of air quality objects
 * @returns {array} Formatted data for export
 */
export const formatAirQualityDataForExport = (data) => {
    return data.map((item, index) => ({
        'No': index + 1,
        'Stasiun': item.station?.name || 'N/A',
        'ISPU': item.ispu || 0,
        'PM2.5': item.pm25 || 0,
        'PM10': item.pm10 || 0,
        'SO2': item.so2 || 0,
        'CO': item.co || 0,
        'O3': item.o3 || 0,
        'NO2': item.no2 || 0,
        'HC': item.hc || 0,
        'Waktu': item.timestamp ? new Date(item.timestamp).toLocaleString('id-ID') : 'N/A'
    }));
};

export default {
    convertToCSV,
    downloadCSV,
    downloadJSON,
    formatStationDataForExport,
    formatAirQualityDataForExport
};
