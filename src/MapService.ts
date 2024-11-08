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

const satelliteLayer = new maptalks.TileLayer('base', {
  urlTemplate: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  subdomains: ['a', 'b', 'c', 'd'],
  attribution:
    '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
});

const mapLayer = new maptalks.TileLayer('base', {
  urlTemplate: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  subdomains: ['a', 'b', 'c', 'd'],
  attribution:
    '&copy; <a href="https://wikimediafoundation.org/">Wikimedia</a>, ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

});



// initialize new map
export function initializeMap(container: HTMLDivElement): void {
  if (!map) {
    map = new maptalks.Map(container, {
      center: [0, 0],
      zoom: 4,
      pitch: 60,
      baseLayer: mapLayer,
    });

    // Initialize the ThreeLayer and add it to the map
    if (!threeLayer) {
      threeLayer = new ThreeLayer('three', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
      });

      threeLayer.addTo(map);
    }
    drawSphere(100);
  }
}

function drawSphere(r: number) {
  if (threeLayer) {
    threeLayer.prepareToDraw = function (gl, scene, camera) {
      const sphereGeometry = new THREE.SphereGeometry(r, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Position the sphere a bit above the map's center
      moveObj(sphere, issLon, issLat, 100000)
      scene.add(sphere);
    }
  }
}


function moveObj(obj: THREE.Mesh, toLon: number, toLat: number, toAlt: number) {
  if (threeLayer) {
    var v3 = threeLayer.coordinateToVector3(new maptalks.Coordinate(toLon, toLat), toAlt)
    obj.position.set(v3.x, v3.y, v3.z)
  }

}

function getISSLocation() {
  fetch(link)
    .then(response => response.json())
    .then(r => {
      issLat = r.latitude;
      issLon = r.longitude;
      issAlt = r.altitude;
    }
    )
    .catch(error => {
      console.error('Error fetching ISS location:', error);
    }
    );
}

export function updateMap(): void {
  getISSLocation()
    map?.setCenter(new maptalks.Coordinate(issLon, issLat))
  if (issAlt !== 0) {
    moveObj(sphere, issLon, issLat, issAlt)
  }

}


export function setSatelliteMap(): void {
  map?.setBaseLayer(satelliteLayer);
}

export function setRegularMap(): void {
  map?.setBaseLayer(mapLayer);
}

// Function to remove the map and threeLayer instances (for cleanup)
export function cleanupMap(): void {
  if (threeLayer) {
    threeLayer.remove();
    threeLayer = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
}
