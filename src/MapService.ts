import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import * as THREE from 'three';


const link = "https://api.wheretheiss.at/v1/satellites/25544";

var issLat = 0;
var issLon = 0;
var issAlt = 0;

let map: maptalks.Map | null = null;
let threeLayer: ThreeLayer | null = null;
let sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;


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
    
    drawSphere(500);

    

  }
}

function drawSphere(r: number) {
  
  if (threeLayer){
    threeLayer.prepareToDraw = function (gl, scene, camera) {
      const sphereGeometry = new THREE.SphereGeometry(r, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      
      // Position the sphere a bit above the map's center
      moveObj(sphere, issLon, issLat, issAlt)
      scene.add(sphere);
    }
  }
}


function moveObj(obj: THREE.Mesh, toLon: number, toLat: number, toAlt: number) {
  if (threeLayer) {
    var v3 = threeLayer.coordinateToVector3(new maptalks.Coordinate(toLon, toLat), toAlt )
    obj.position.set(v3.x, v3.y, v3.z)
  }
  
}

async function getISSLocation() {
  let r = await (await fetch(link)).json();
  issLat = r.latitude;
  issLon = r.longitude;
  issAlt = r.altitude * 100;
}

export function updateMap() : void {
  getISSLocation()
  if (map)
    map.setCenter(new maptalks.Coordinate(issLon, issLat))

  moveObj(sphere, issLon, issLat, issAlt)
  
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
