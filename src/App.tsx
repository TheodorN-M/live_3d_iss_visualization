import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import * as maptalks from 'maptalks';


const link = "https://api.wheretheiss.at/v1/satellites/25544";

async function getISSLocation(){
  let r = await (await fetch(link)).json();

  console.log(r);
}

function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null); // Ref for the map container
  const map = useRef<maptalks.Map | null>(null); // Ref for the map instance

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Initialize the map only once when the component mounts
      map.current = new maptalks.Map(mapContainer.current, {
        center: [0, 0],
        zoom: 2,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          attribution:
            '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        }),
      });
    }

    // Clean up map instance on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getISSLocation}>Update ISS Location</button>
      </header>
      <div
        id="map"
        ref={mapContainer}
        style={{
          width: '100%',
          height: '500px',
        }}
      ></div>
    </div>
  );
}

export default App;
