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

async function loadCountriesData() {
  try {
    const response = await fetch('assets/data/countries.json');
    data.countries = await response.json();
  } catch (error) {
    console.error("Error al cargar countries.json:", error);
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
      console.log("Selected Country:", countryName);

      const info = data.countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());

      if (info) {
        const card = document.querySelector('.country-card');
        const countryInfo = document.querySelector('.country-info');
        const countryTitle = document.querySelector('.country-card h2');
    
        countryTitle.textContent = info.name;
        const countryImage = document.querySelector('.map-stats img');
        countryImage.src = info.image;
        countryImage.alt = info.name;
        document.querySelector('.map-stats .rank strong').textContent = "Rank: " + info.ranking;
        document.querySelector('.map-stats p:nth-child(3)').textContent = "IPs reported last Month: " + info.ips_last_month;
        document.querySelector('.map-stats p:nth-child(4)').textContent = "IPs reported in total: " + info.ips_total;
        updateIpTable(info.ips);
    
        const globe = document.querySelector('.globe');
        globe.classList.add('shifted');
    
        if (!cardAnimated) {
          card.classList.add('show');
          card.addEventListener('animationend', function handler() {
            countryInfo.classList.add('show');
            card.removeEventListener('animationend', handler);
            cardAnimated = true;
          });
        } else {
          countryImage.onload = () => {
            console.log("Image loaded, now animating...");
            countryInfo.classList.remove('show');
            void countryInfo.offsetWidth; 
            countryInfo.classList.add('show');
          };
        }
      }
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


  app.scene.add(groups.main);
}


function animate(app) {
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
}


