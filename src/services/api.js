import { API_CONFIG } from '../config';

const APIService = {
    fetch: async (endpoint, options = {}) => {
        try {
            const url = `${API_CONFIG.BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getHealth: async () => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.HEALTH);
    },

    getStations: async (province = null) => {
        const endpoint = province
            ? `${API_CONFIG.ENDPOINTS.STATIONS}?province=${encodeURIComponent(province)}`
            : API_CONFIG.ENDPOINTS.STATIONS;
        return await APIService.fetch(endpoint);
    },

    getLatestAirQuality: async () => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.AIR_QUALITY_LATEST);
    },

    getDashboardOverview: async () => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.DASHBOARD_OVERVIEW);
    },

    getCategories: async () => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.CATEGORIES);
    },

    getMapStations: async () => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.MAP_STATIONS);
    },

    getStationById: async (id) => {
        return await APIService.fetch(`${API_CONFIG.ENDPOINTS.STATIONS}/${id}`);
    },

    getStationHistory: async (stationId, startDate, endDate) => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate
        });
        return await APIService.fetch(`/air-quality/station/${stationId}?${params}`);
    },

    createStation: async (stationData) => {
        return await APIService.fetch(API_CONFIG.ENDPOINTS.STATIONS, {
            method: 'POST',
            body: JSON.stringify(stationData)
        });
    },

    insertAirQuality: async (data) => {
        return await APIService.fetch('/air-quality', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

export default APIService;
