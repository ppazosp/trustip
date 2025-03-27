const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}
const data = {}
let  cardAnimated = false;


async function preload() {
  try {

    await loadCountriesData();

    return true;
  } catch(error) {
    console.log(error);
  }
}

function populateCountryDatalist() {
  const datalist = document.getElementById("countries");
  datalist.innerHTML = "";
  data.countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country.name;
    datalist.appendChild(option);
  });
}

async function loadCountriesData() {
  try {
    const response = await fetch('assets/data/countries.json');
    data.countries = await response.json();
    populateCountryDatalist();
  } catch (error) {
    console.error("Error al cargar countries.json:", error);
  }
}

function printCameraPosition() {
  const { x, y, z } = app.camera.position;
  console.log(`Camera Position -> x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}`);
}

function latLngToCartesian(latDeg, lngDeg, radius) {
  // Convert degrees to radians
  const lat = THREE.Math.degToRad(latDeg);
  const lng = THREE.Math.degToRad(lngDeg);

  // Using conventional spherical coordinates so that:
  // lat = 0, lng = 0 yields (0, 0, radius) (i.e. the initial camera position).
  const x = -radius * Math.cos(lat) * Math.sin(lng);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.cos(lng);

  return { x, y, z };
}

function latLngToCameraPosition(latDeg, lonDeg, distance) {
  const offsetLat = 4;      
  const offsetTheta = 0.07;   
  
  const phi = THREE.Math.degToRad(90 - (latDeg - offsetLat));
  
  const theta = -THREE.Math.degToRad(lonDeg) + offsetTheta;
  
  const x = distance * Math.sin(phi) * Math.cos(theta);
  const y = distance * Math.cos(phi);
  const z = distance * Math.sin(phi) * Math.sin(theta);
  
  return { x, y, z };
}

function goToCountry(info) {
  // Stop auto-rotation if needed.
  animations.rotateGlobe = false;

  // Get the input latitude and longitude.
  const lat = parseFloat(info.latitude);
  const lon = parseFloat(info.longitude);
  
  // Use the current camera distance so the zoom level stays the same.
  const currentDistance = app.camera.position.length();
  
  // Compute the desired camera position.
  const targetPos = latLngToCameraPosition(lat, lon, currentDistance);
  
  // Animate the camera position to the target.
  const startPos = { 
    x: app.camera.position.x,
    y: app.camera.position.y,
    z: app.camera.position.z
  };
  
  new TWEEN.Tween(startPos)
    .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1500) // animate over 1.5s
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      app.camera.position.set(startPos.x, startPos.y, startPos.z);
      app.controls.update();
    })
    .start();
  
  // Ensure the controls always look at the globe center.
  app.controls.target.set(0, 0, 0);
  app.controls.update();
}


function selectCountry(countryName) {
  const info = data.countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
  if (info) {
    console.log("Selected Country:", info.name);

    const card = document.querySelector('.country-card');
    const countryInfo = document.querySelector('.country-info');
    const countryTitle = document.querySelector('.country-card h2');

    countryTitle.textContent = info.name;
    const countryImage = document.querySelector('.map-stats img');
    countryImage.src = info.image;
    countryImage.alt = info.name;
    document.querySelector('.map-stats .rank span').textContent = "Rank: ";
    document.querySelector('.map-stats .rank strong').textContent = info.ranking;
    document.querySelector('.map-stats p:nth-child(3)').textContent =
      "IPs reported last Month: " + info.ips_last_month;
    document.querySelector('.map-stats p:nth-child(4)').textContent =
      "IPs reported in total: " + info.ips_total;
    updateIpTable(info.ips);

    if (!cardAnimated) {
      card.classList.add('show');
      card.addEventListener('animationend', function handler() {
        countryInfo.classList.add('show');
        card.removeEventListener('animationend', handler);
        cardAnimated = true;
      });
    } else {
      countryInfo.classList.remove('show');
      void countryInfo.offsetWidth;
      countryInfo.classList.add('show');
    }

    // Now rotate the globe to face the selected country
    goToCountry(info);

  } else {
    console.log("Country not found:", countryName);
  }
}

function updateIpTable(ips) {
  const tbody = document.querySelector('.ip-scroll table tbody');
  tbody.innerHTML = "";
  ips.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.ip}</td>
      <td>${entry.nor}</td>
      <td>${entry.dlr}</td>
    `;
    tbody.appendChild(tr);
  });
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

function onSubmit(event){
  event.preventDefault();
  const searchInput = document.querySelector('.search-form input[name="search"]');
  const query = searchInput.value.trim();
  if (query) {
    selectCountry(query);
  }
}

function onChange(event){
  const query = event.target.value.trim();
  if (query) {
    selectCountry(query);
  }
}

function setup(app) {
  const container = document.querySelector('.globe');
  const width = container.clientWidth;
  const height = container.clientHeight;
  app.renderer.setSize(width, height);
  app.camera.aspect = width / height;
  app.camera.updateProjectionMatrix();

  //const controllers = [];

  /*app.addControlGui(gui => {
    const colorFolder = gui.addFolder('Colors');
    controllers.push(colorFolder.addColor(config.colors, 'globeDotColor'))
    controllers.push(colorFolder.addColor(config.colors, 'globeMarkerColor'))
    controllers.push(colorFolder.addColor(config.colors, 'globeMarkerGlow'))
    controllers.push(colorFolder.addColor(config.colors, 'globeLines'))
    controllers.push(colorFolder.addColor(config.colors, 'globeLinesDots'))
    
    const sizeFolder = gui.addFolder('Sizes')
    controllers.push(sizeFolder.add(config.sizes, 'globeDotSize', 1, 5))
    controllers.push(sizeFolder.add(config.scale, 'globeScale', 0.1, 1))
    
    const displayFolder = gui.addFolder('Display');
    controllers.push(displayFolder.add(config.display, 'map'))
    controllers.push(displayFolder.add(config.display, 'points'))
    controllers.push(displayFolder.add(config.display, 'markers'))
    controllers.push(displayFolder.add(config.display, 'markerLabel'))
    controllers.push(displayFolder.add(config.display, 'markerPoint'))
    
    const animationsFolder = gui.addFolder('Animations');
    controllers.push(animationsFolder.add(animations, 'rotateGlobe'))

    
    sizeFolder.open();
  });

  controllers.forEach(controller => {
    controller.onChange((event) => {
      controls.changed = true;
    })
  })*/

  app.camera.position.z = config.sizes.globe * 2.85;
  app.camera.position.y = config.sizes.globe * 0;
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

  /*const lines = new Lines();
  groups.globe.add(groups.lines);*/

  container.addEventListener('click', onMouseClick, false);

  document.querySelector('.search-form').addEventListener('submit', onSubmit);

  document.querySelector('.search-form input[name="search"]').addEventListener('change', onChange);


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
    groups.globe.rotation.y -= 0.0005;
  }

  //printCameraPosition(); 
}
