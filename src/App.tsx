import React, { useEffect, useRef } from 'react';
import './App.css';
import {initializeMap, cleanupMap, updateMap} from './MapService';


function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Ref for the map container

  useEffect(() => {
    if (mapContainer.current) {
      initializeMap(mapContainer.current);
    }

    // Clean up the map on component unmount
    return () => {
      cleanupMap();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={updateMap}>Update ISS Location</button>
        <div id="map"
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