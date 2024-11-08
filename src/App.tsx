import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { initializeMap, cleanupMap, updateMap, setRegularMap, setSatelliteMap } from './MapService';

function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null); 
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [satelliteView, setSatelliteView] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      initializeMap(mapContainer.current);
    }

    // Clean up the map on component unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      cleanupMap();
    };
  }, []);

  const toggleUpdates = () => {
    if (isAutoUpdating) {
      // Stop updates
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsAutoUpdating(false);
    } else {
      // Start updates
      if (updateInterval && updateInterval >= 1000) {
        intervalRef.current = setInterval(() => {
          updateMap();
        }, updateInterval);
        setIsAutoUpdating(true);
      }
    }
  };

  const findISS = () => {
    updateMap();
  }

  const changeMapLayer = () => {
    if (satelliteView) {
      // Change to map view
      setRegularMap();
      setSatelliteView(false);
    }
    else {
      // Change to satellite view
      setSatelliteMap();
      setSatelliteView(true);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ISS Location Tracker</h1>
        
        <div className="controls-container">
          <div className="controls">
            <label htmlFor="intervalInput">Update Interval (ms): </label>
            <input
              type="number"
              id="intervalInput"
              value={updateInterval ?? ''}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
            />
            <button onClick={toggleUpdates}>
              {isAutoUpdating ? 'Stop Auto Updates' : 'Start Auto Updates'}
            </button>
            <button onClick={findISS}>Find ISS</button>
            <button onClick={changeMapLayer}>
              {satelliteView ? 'Map view' : 'Satellite view'}
            </button>
          </div>
        </div>

        <div
          id="map"
          ref={mapContainer}
        ></div>
      </header>
    </div>
  );
}

export default App;
