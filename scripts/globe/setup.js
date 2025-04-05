const app = new App({ setup, animate });
window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}

function goToCountry(info) {
  animations.rotateGlobe = false;

  const lat = parseFloat(info.latitude);
  const lon = parseFloat(info.longitude);
  
  const currentDistance = app.camera.position.length();
  
  const targetPos = latLngToCameraPosition(lat, lon, currentDistance);
  
  const startPos = { 
    x: app.camera.position.x,
    y: app.camera.position.y,
    z: app.camera.position.z
  };
  
  new TWEEN.Tween(startPos)
    .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1500) 
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      app.camera.position.set(startPos.x, startPos.y, startPos.z);
      app.controls.update();
    })
    .start();
  
  app.controls.target.set(0, 0, 0);
  app.controls.update();
}


function onMouseClick(event) {
  event.preventDefault();
  
  const container = document.querySelector('.globe');
  const rect = container.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, app.camera);
  const intersects = raycaster.intersectObjects(groups.markers.children, true);
  
  if (intersects.length > 0) {
    let markerObject = intersects[0].object;
    while (markerObject && markerObject.name !== 'Marker') {
      markerObject = markerObject.parent;
    }
    const countryName = markerObject ? markerObject.userData.countryName : null;
    if (countryName) {
      selectCountry(countryName);
    }
  }
}

function setup(app) {
  const container = document.querySelector('.globe');
  const width = container.clientWidth;
  const height = container.clientHeight;

  app.renderer.setSize(width, height);
  app.camera.aspect = width / height;
  app.camera.updateProjectionMatrix();

  app.camera.position.z = config.sizes.globe;
  app.camera.position.y = 0;
  app.controls.enableDamping = true;
  app.controls.dampingFactor = 0.05;
  app.controls.rotateSpeed = 0.05;

  groups.main = new THREE.Group();
  groups.main.name = 'Main';

  const globe = new Globe();
  groups.main.add(globe);

  const points = new Points(data.grid);
  groups.globe.add(groups.points);

  const markers = new Markers(data.countries);
  groups.globe.add(groups.markers);

  container.addEventListener('click', onMouseClick, false);
  
  app.scene.add(groups.main);
}


function animate(app) {
  TWEEN.update();
  
  if(controls.changed) {
    if(elements.globePoints) {
      elements.globePoints.material.size = config.sizes.globeDotSize;
      elements.globePoints.material.color.set(config.colors.globeDotColor);
    }

    if(elements.globe) {
      elements.globe.scale.set(
        config.scale.globeScale, 
        config.scale.globeScale, 
        config.scale.globeScale
      );
    }

    if(elements.lines) {
      for(let i = 0; i < elements.lines.length; i++) {
        const line = elements.lines[i];
        line.material.color.set(config.colors.globeLines);
      }
    }

    groups.map.visible = config.display.map;
    groups.markers.visible = config.display.markers;
    groups.points.visible = config.display.points;

    for(let i = 0; i < elements.markerLabel.length; i++) {
      const label = elements.markerLabel[i];
      label.visible = config.display.markerLabel;
    }

    for(let i = 0; i < elements.markerPoint.length; i++) {
      const point = elements.markerPoint[i];
      point.visible = config.display.markerPoint;
    }

    controls.changed = false
  }



  if(elements.lineDots) {
    for(let i = 0; i < elements.lineDots.length; i++) {
      const dot = elements.lineDots[i];
      dot.material.color.set(config.colors.globeLinesDots);
      dot.animate();
    }
  }

  if(elements.markers) {
    for(let i = 0; i < elements.markers.length; i++) {
      const marker = elements.markers[i];
      marker.point.material.color.set(config.colors.globeMarkerColor);
      marker.glow.material.color.set(config.colors.globeMarkerGlow);
      marker.label.material.map.needsUpdate = true;
      marker.animateGlow();
    }
  }

  if(animations.rotateGlobe) {
    rotateCameraAroundGlobe();
  }

}
