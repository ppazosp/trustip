const config = {
	urls: {
		globeTexture: '../assets/textures/earth_night.jpg',
		pointTexture: '../assets/imgs/disc.png'
	},
	sizes: {
		globe: 200,
		globeDotSize: 4
	},
	scale: {
		points: 0.025,
		markers: 0.025,
		globeScale: 1
	},
	rotation: {
		globe: 0.001
	},
	colors: {
		globeDotColor: 'rgb(18, 61, 21)',
		globeMarkerColor: 'rgb(61, 23, 18)',
		globeMarkerGlow: 'rgb(187, 102, 102)',
	},
	display: {
		points: true,
		map: true,
		markers: true,
		markerLabel: true,
		markerPoint: true
	}
}

const elements = {
	globe: null,
	atmosphere: null,
	globePoints: null,
	markers: [],
	markerLabel: [],
	markerPoint: [],
}

const textures = {
	markerLabels: []
}

const groups = {
	map: null,
	main: null,
	globe: null,
	points: null,
	markers: null,
	atmosphere: null,
}

const countries = {
	interval: 20000,
	selected: null,
	index: 0
}

const animations = {
  rotateGlobe: true
}