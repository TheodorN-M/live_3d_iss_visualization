import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { initializeMap, cleanupMap, updateMap } from './MapService';

function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Ref for the map container
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
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

  const handleStartUpdates = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (updateInterval && updateInterval > 0) {
      intervalRef.current = setInterval(() => {
        updateMap();
      }, updateInterval);
    }
  };

  const handleStopUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label htmlFor="intervalInput">Update Interval (ms): </label>
          <input
            type="number"
            id="intervalInput"
            value={updateInterval ?? ''}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
          />
        </div>
        <button onClick={handleStartUpdates}>Start Auto Updates</button>
        <button onClick={handleStopUpdates}>Stop Auto Updates</button>
        <div
          id="map"
          ref={mapContainer}
          style={{
            width: '100%',
            height: '500px',
          }}
        ></div>
      </header>
    </div>
  );
}

export default App;
