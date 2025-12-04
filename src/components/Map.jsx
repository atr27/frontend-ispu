import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { MAP_CONFIG } from '../config';
import { getISPUColor, getISPUCategory, getISPUDetails } from '../utils/colorUtils';
import './Map.css';

const MapComponent = ({ stations }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const vectorSource = useRef(new VectorSource());
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Create popup element manually to avoid React DOM conflict
        const popupElement = document.createElement('div');
        popupElement.className = 'ol-popup';

        const popupCloser = document.createElement('a');
        popupCloser.href = '#';
        popupCloser.className = 'ol-popup-closer';
        popupElement.appendChild(popupCloser);

        const popupContent = document.createElement('div');
        popupElement.appendChild(popupContent);

        const closePopup = () => {
            if (overlayRef.current) {
                overlayRef.current.setPosition(undefined);
            }
            popupCloser.blur();
            return false;
        };

        popupCloser.onclick = closePopup;

        // Create overlay
        overlayRef.current = new Overlay({
            element: popupElement,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });

        // Initialize map
        mapInstance.current = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                    })
                }),
                new VectorLayer({
                    source: vectorSource.current
                })
            ],
            overlays: [overlayRef.current],
            view: new View({
                center: fromLonLat(MAP_CONFIG.CENTER),
                zoom: MAP_CONFIG.ZOOM
            })
        });

        // Click handler
        mapInstance.current.on('singleclick', function (evt) {
            const feature = mapInstance.current.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                const station = feature.get('station');
                const ispu = station.ispu || 0;

                // Determine category and color using utility
                const color = getISPUColor(ispu);
                const category = getISPUCategory(ispu);

                // Format date
                const date = new Date().toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                // Pollutant data
                const pollutants = [
                    { name: 'PM10', value: station.pm10 || 0 },
                    { name: 'PM2.5', value: station.pm25 || 0 },
                    { name: 'SO2', value: station.so2 || 0 },
                    { name: 'CO', value: station.co || 0 },
                    { name: 'O3', value: station.o3 || 0 },
                    { name: 'NO2', value: station.no2 || 0 },
                    { name: 'HC', value: station.hc || 0 }
                ];

                const pollutantBars = pollutants.map(p => `
                    <div class="pollutant-bar-container">
                        <div class="pollutant-value">${Math.round(p.value)}</div>
                        <div class="pollutant-bar">
                            <div class="pollutant-fill" style="height: ${Math.min(p.value, 100)}%; background-color: ${color};"></div>
                        </div>
                        <div class="pollutant-name">${p.name}</div>
                    </div>
                `).join('');

                popupContent.innerHTML = `
                    <div class="popup-header">
                        <h3 class="popup-title">${station.name}</h3>
                        <p class="popup-address">${station.address || 'Alamat tidak tersedia'}</p>
                    </div>
                    
                    <div class="ispu-box" style="background-color: ${color}">
                        <div class="ispu-label">ISPU ${category}</div>
                        <div class="ispu-value">${ispu}</div>
                        <div class="ispu-date">PM2.5 & O3 | ${date}</div>
                    </div>

                    <div class="pollutant-chart">
                        ${pollutantBars}
                    </div>

                    <div class="legend-container">
                        <div class="legend-item legend-baik">BAIK</div>
                        <div class="legend-item legend-sedang">SEDANG</div>
                        <div class="legend-item legend-tidak-sehat">TIDAK SEHAT</div>
                        <div class="legend-item legend-sangat-tidak-sehat">SANGAT TIDAK SEHAT</div>
                        <div class="legend-item legend-berbahaya">BERBAHAYA</div>
                    </div>
                `;
                overlayRef.current.setPosition(coordinates);
            } else {
                overlayRef.current.setPosition(undefined);
            }
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(null);
            }
        };
    }, []);

    // Update markers when stations change
    useEffect(() => {
        if (!stations || !vectorSource.current) return;

        vectorSource.current.clear();

        stations.forEach(station => {
            const ispu = station.ispu || 0;
            // Use centralized color utility for consistency
            const color = getISPUColor(ispu);

            const feature = new Feature({
                geometry: new Point(fromLonLat([station.longitude, station.latitude])),
                station: station
            });

            const style = new Style({
                image: new Circle({
                    radius: 15,
                    fill: new Fill({ color: color }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2
                    })
                }),
                text: new Text({
                    text: ispu.toString(),
                    fill: new Fill({ color: '#fff' }),
                    stroke: new Stroke({ color: '#000', width: 2 }), // Stroke for visibility
                    offsetY: 1,
                    font: 'bold 12px sans-serif'
                })
            });

            feature.setStyle(style);
            vectorSource.current.addFeature(feature);
        });

        // Fit map
        if (stations.length > 0 && mapInstance.current) {
            const extent = vectorSource.current.getExtent();
            mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
        }
    }, [stations]);

    // Zoom control functions
    const handleZoomIn = () => {
        if (mapInstance.current) {
            const view = mapInstance.current.getView();
            const currentZoom = view.getZoom();
            view.animate({
                zoom: currentZoom + 1,
                duration: 250
            });
        }
    };

    const handleZoomOut = () => {
        if (mapInstance.current) {
            const view = mapInstance.current.getView();
            const currentZoom = view.getZoom();
            view.animate({
                zoom: currentZoom - 1,
                duration: 250
            });
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapRef} className="map-container" id="map"></div>

            {/* Zoom Controls */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 1000
            }}>
                <button
                    onClick={handleZoomIn}
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#fff',
                        border: '2px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f0f0f0';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.transform = 'scale(1)';
                    }}
                    title="Zoom In"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#fff',
                        border: '2px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f0f0f0';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.transform = 'scale(1)';
                    }}
                    title="Zoom Out"
                >
                    −
                </button>
            </div>

            {/* Map Legend Overlay */}
            <div className="map-legend-overlay">
                <div className="legend-item-overlay">
                    <div className="legend-color-box" style={{ backgroundColor: '#00e400' }}></div>
                    <span>0 - 50 BAIK</span>
                </div>
                <div className="legend-item-overlay">
                    <div className="legend-color-box" style={{ backgroundColor: '#0000FF' }}></div>
                    <span>51 - 100 SEDANG</span>
                </div>
                <div className="legend-item-overlay">
                    <div className="legend-color-box" style={{ backgroundColor: '#eebb00' }}></div>
                    <span>101 - 200 TIDAK SEHAT</span>
                </div>
                <div className="legend-item-overlay">
                    <div className="legend-color-box" style={{ backgroundColor: '#ff0000' }}></div>
                    <span>201 - 300 SANGAT TIDAK SEHAT</span>
                </div>
                <div className="legend-item-overlay">
                    <div className="legend-color-box" style={{ backgroundColor: '#8f3f97' }}></div>
                    <span>301 - 300+ BERBAHAYA</span>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
