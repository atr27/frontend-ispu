export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api/v1',
    ENDPOINTS: {
        HEALTH: '/health',
        STATIONS: '/stations',
        AIR_QUALITY_LATEST: '/air-quality/latest',
        DASHBOARD_OVERVIEW: '/dashboard/overview',
        CATEGORIES: '/categories',
        MAP_STATIONS: '/map/stations'
    },
    REFRESH_INTERVAL: 300000 // 5 minutes
};

export const ISPU_COLORS = {
    'Baik': '#00e400',
    'Sedang': '#0000FF',
    'Tidak Sehat': '#ff7e00',
    'Sangat Tidak Sehat': '#ff0000',
    'Berbahaya': '#8f3f97'
};

export const MAP_CONFIG = {
    CENTER: [118.0149, -2.5489], // Indonesia center [lon, lat]
    ZOOM: 5
};
