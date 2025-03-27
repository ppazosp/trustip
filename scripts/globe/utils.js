function toSphereCoordinates(lat, lng, scale) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;
  var x = scale * Math.sin(phi) * Math.cos(theta);
  var y = scale * Math.cos(phi);
  var z = scale * Math.sin(phi) * Math.sin(theta);
  return {x, y, z};
}

function returnCurveCoordinates(latitudeA, longitudeA, latitudeB, longitudeB, size) {
  const start = toSphereCoordinates(latitudeA, longitudeA, size);
  const end = toSphereCoordinates(latitudeB, longitudeB, size);

  const midPointX = (start.x + end.x) / 2;
  const midPointY = (start.y + end.y) / 2;
  const midPointZ = (start.z + end.z) / 2;

  let distance = Math.pow(end.x - start.x, 2);
  distance += Math.pow(end.y - start.y, 2);
  distance += Math.pow(end.z - start.z, 2);
  distance = Math.sqrt(distance);


  let multipleVal = Math.pow(midPointX, 2);
  multipleVal += Math.pow(midPointY, 2);
  multipleVal += Math.pow(midPointZ, 2);

  multipleVal = Math.pow(distance, 2) / multipleVal;
  multipleVal = multipleVal * 0.7;

  let midX = midPointX + multipleVal * midPointX ;
  let midY = midPointY + multipleVal * midPointY ;
  let midZ = midPointZ + multipleVal * midPointZ ;


  return {
    start: {
      x: start.x,
      y: start.y,
      z: start.z,
    },
    mid: {
      x: midX,
      y: midY,
      z: midZ,
    },
    end: {
      x: end.x,
      y: end.y,
      z: end.z,
    },
  };
};



const GLOBE_RADIUS = 200;
const CURVE_MIN_ALTITUDE = 20;
const CURVE_MAX_ALTITUDE = 200;
const DEGREE_TO_RADIAN = Math.PI / 180;

function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

function coordinateToPosition(lat, lng, radius) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;

  return new THREE.Vector3(
    - radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    - radius * Math.sin(phi) * Math.sin(theta)
  );
}

function getSplineFromCoords(latitudeA, longitudeA, latitudeB, longitudeB, size) {
  const start = coordinateToPosition(latitudeA, longitudeA, size);
  const end = coordinateToPosition(latitudeB, longitudeB, size);
  
  // altitude
  const altitude = clamp(start.distanceTo(end) * .45, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
  
  // 2 control points
  const interpolate = d3.geoInterpolate([longitudeA, latitudeA], [longitudeB, latitudeB]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
  const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);

  return {start, end, mid1, mid2};
}

function printCameraPosition() {
  const { x, y, z } = app.camera.position;
  console.log(`Camera Position -> x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}`);
}

function latLngToCameraPosition(latDeg, lonDeg, distance) {
  const offsetLat = 0;      
  const offsetTheta = 0;   
  
  const phi = THREE.Math.degToRad(90 - (latDeg - offsetLat));
  
  const theta = -THREE.Math.degToRad(lonDeg) + offsetTheta;
  
  const x = distance * Math.sin(phi) * Math.cos(theta);
  const y = distance * Math.cos(phi);
  const z = distance * Math.sin(phi) * Math.sin(theta);
  
  return { x, y, z };
}


