import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MapComponent from './components/Map';
import Legends from './components/Legends';
import StationLocationPage from './pages/StationLocationPage';
import ErrorBoundary from './components/ErrorBoundary';
import APIService from './services/api';
import './index.css';

function App() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await APIService.getMapStations();
        if (response.success && response.data) {
          setStations(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      }
    };

    fetchStations();

    // Refresh interval
    const interval = setInterval(fetchStations, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  const handleStationSelect = (station) => {
    // Logic to zoom to station or show details
    console.log('Selected station:', station);
    // This could be passed to MapComponent to trigger a view update
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout stations={stations} onStationSelect={handleStationSelect} />}>
            <Route index element={
              <>
                <MapComponent stations={stations} />
                <Legends />
              </>
            } />
            <Route path="stasiun" element={<StationLocationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
