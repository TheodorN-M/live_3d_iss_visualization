import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { initializeMap, cleanupMap, updateMap } from './MapService';

function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null); 
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
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
      if (updateInterval && updateInterval > 0) {
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
    
  }
  // var buttonText = "Satellite"

  return (
    <div className="App">
      <header className="App-header">
      <h1>ISS Location Tracker</h1>
        <div>
          <label htmlFor="intervalInput">Update Interval (ms): </label>
          <input
            type="number"
            id="intervalInput"
            value={updateInterval ?? ''}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
          />
        </div>
        <button onClick={toggleUpdates}>
          {isAutoUpdating ? 'Stop Auto Updates' : 'Start Auto Updates'}
        </button>
        <button onClick={findISS}>Find ISS</button>
        {/* <button id="satelliteButton" onClick={changeMapLayer}></button> */}
        <div
          id="map"
          ref={mapContainer}
          style={{
            width: '100%',
            height: '800px',
          }}
        ></div>
      </header>
    </div>
  );
}

export default App;
