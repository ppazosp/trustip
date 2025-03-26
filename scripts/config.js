const config = {
	urls: {
		globeTexture: '../assets/textures/earth_day.jpg',
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
		//globeLines: 'rgb(255, 255, 255)',
		//globeLinesDots: 'rgb(255, 255, 255)'
	},
	display: {
		points: true,
		map: true,
		//lines: false,
		markers: true,
		markerLabel: true,
		markerPoint: true
	},
	dots: {
		total: 30
	}
}

const elements = {
	globe: null,
	atmosphere: null,
	globePoints: null,
	//lineDots: [],
	markers: [],
	markerLabel: [],
	markerPoint: [],
	//lines: []
}

const textures = {
	markerLabels: []
}

const groups = {
	map: null,
	main: null,
	globe: null,
	//lines: null,
	points: null,
	markers: null,
	atmosphere: null,
	//lineDots: null,
}

const countries = {
	interval: 20000,
	selected: null,
	index: 0
}

const animations = {
  rotateGlobe: true
}