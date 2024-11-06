import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import * as THREE from 'three';


const link = "https://api.wheretheiss.at/v1/satellites/25544";

var issLat = 0;
var issLon = 0;
var issAlt = 0;

let map: maptalks.Map | null = null;
let threeLayer: ThreeLayer | null = null;

// initialize new map
export function initializeMap(container: HTMLDivElement) : void {
  if (!map) {
    map = new maptalks.Map(container, {
      center: [0, 0],
      zoom: 4,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution:
          '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' +
          '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      }),
    });

    // Initialize the ThreeLayer and add it to the map
    if (!threeLayer){
        threeLayer = new ThreeLayer('three', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
        });
        
        threeLayer.addTo(map);
    }
    
    threeLayer.prepareToDraw = function (gl, scene, camera) {
    const sphereGeometry = new THREE.SphereGeometry(5000, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Position the sphere a bit above the map's center
      var v3 = this.coordinateToVector3([issLon, issLat, issAlt])
      sphere.position.set(v3.x, v3.y, v3.z)
      scene.add(sphere);
    }

    

  }
}

async function getISSLocation() {
  let r = await (await fetch(link)).json();
  issLat = r.latitude;
  issLon = r.longitude;
  issAlt = r.altitude;
  console.log(issLat, issLon)
}

export function updateMap() : void {
  getISSLocation()
  if (map)
    map.setCenter(new maptalks.Coordinate(issLon, issLat))

  
}


// Function to remove the map and threeLayer instances (for cleanup)
export function cleanupMap() : void {
  if (threeLayer) {
    threeLayer.remove();
    threeLayer = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
}
