class App {
  constructor({ animate, setup }) {
    this.animate = animate;
    this.setup = setup;
    window.app = this;

    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  init = async () => {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initControls();

    this.render();
    this.update();
  }

  initScene = () => {
    this.scene = new THREE.Scene();
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x181818, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.renderer.shadowMap.enabled = true;
    this.renderer.antialias = true;
  }

  initCamera = () => {
    this.ratio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, this.ratio, 0.1, 10000);
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 0, 0);
  }

  initControls = () => {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.controls.minDistance = 460;
    this.controls.maxDistance = 460;
    this.controls.enableZoom = false;
    this.controls.enableKeys = false;
    this.controls.enablePan = false;
  }

  render = () => {
    this.setup(this);
    this.container = document.querySelector('.globe');
    this.container.appendChild(this.renderer.domElement);
  }

  update = () => {
    const now = performance.now();
    const frameTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.accumulator += frameTime;
    const dt = 1 / 60
    
    while (this.accumulator >= dt) {
      this.animate(this);
      this.accumulator -= dt;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update);
  }

  handleResize = () => {
    const container = document.querySelector('.globe');
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  
    this.renderer.setSize(width, height);
  }
}