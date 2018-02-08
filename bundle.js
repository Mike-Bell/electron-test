const THREE = require('three');
const Interaction = require('three.interaction').Interaction;
const OrbitControls = require('three-orbitcontrols');

const activeThickness = 1;
const inactiveThickness = 0.1;
const gridWidth = 10;
const gridHeight = 10;
const boardThickness = 0.1;
const cellThickness = 0.01;
const activeCellScale = 2.0;
const inactiveCellScale = 1.0;
const boardWidth = 1;
const boardHeight = 1;
const cellSpacingRatio = 0.2;
const cellWidth = boardWidth / gridWidth * (1 - cellSpacingRatio);
const cellHeight = boardHeight / gridHeight * (1 - cellSpacingRatio);

const windowHeightMargin = 100;
const windowWidthMargin = 10;

let playing = false;

const run = () => {
	const camera = new THREE.PerspectiveCamera(70, window.innerWidth - windowWidthMargin / window.innerHeight - windowHeightMargin, 0.01, 10);
	camera.position.z = 1.2;
	const controls = new OrbitControls(camera);
	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({antialias: true});
	scene.add(new THREE.AmbientLight({intensity: 2.0}));
	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-30, 60, 60);
	spotLight.castShadow = true;
	scene.add(spotLight);
	
	const grid = new THREE.Mesh(new THREE.BoxGeometry(boardWidth, boardHeight, boardThickness), new THREE.MeshLambertMaterial({color: 0xbbbbbb}));
	scene.add(grid);
	grid.state = {active: false};
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	window.document.body.appendChild(renderer.domElement);

	const interaction = new Interaction(renderer, scene, camera);

	const updateCellActiveState = (cell, newState) => {
		if (cell.state.active === newState) {
			return;
		}

		cell.state.active = newState;
		cell.scale.z = cell.state.active ? activeCellScale : inactiveCellScale;
		cell.position.z = boardThickness / 2 + cellThickness * (cell.state.active ? activeCellScale : inactiveCellScale) / 2;
		cell.material.color.set(cell.state.active ? 0x226622 : 0x666666);
	}

	const cells = [...Array(gridWidth).keys()].map(i => {
		return [...Array(gridHeight).keys()].map(j => {
			const cell = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, cellHeight, cellThickness), new THREE.MeshLambertMaterial({color: 0x666666}));
			cell.state = {active: false};
			cell.position.x = (i + 0.5) * cellWidth - boardWidth / 2 + cellSpacingRatio * cellWidth * (i + 1);
			cell.position.y = (j + 0.5) * cellHeight - boardHeight / 2 + cellSpacingRatio * cellHeight * (j + 1);
			cell.scale.z = inactiveCellScale;
			scene.add(cell);
			cell.on('click', () => {
				updateCellActiveState(cell, !cell.state.active);
			});
			cell.position.z = boardThickness / 2 + cellThickness * (cell.state.active ? activeCellScale : inactiveCellScale) / 2;
			return cell;
		});
	});
	
	window.addEventListener('resize', () => {
		camera.aspect = (window.innerWidth - windowWidthMargin) / (window.innerHeight - windowHeightMargin);
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth - windowWidthMargin, window.innerHeight - windowHeightMargin);
	}, false);

	window.onload = () => {
		window.document.getElementsByClassName('play-button')[0].onclick = function() {
			playing = !playing;
			this.innerHTML = playing ? 'pause' : 'play';
		}
	};
	
	window.setInterval(() => {
		if (!playing) {
			return;
		}
		
		nextStates = [];

		cells.forEach((row, i) => {
			nextStates.push([]);
			row.forEach((cell, j) => {
				let liveNeighbors = 0;
				let shouldLive = false;
				[-1, 0, 1].forEach(di => {
					[-1, 0 ,1].forEach(dj => {
						const neighbor = cells[i + di] && cells[i + di][j + dj];
						liveNeighbors += !!(neighbor && neighbor.state.active);					
					});
				});

				liveNeighbors = liveNeighbors - cell.state.active;

				if (!cell.state.active) {
					shouldLive = liveNeighbors === 3;
				} else {
					shouldLive = liveNeighbors === 2 || liveNeighbors === 3;
				}

				nextStates[i].push(shouldLive);
			});
		});

		cells.forEach((row, i) => {
			row.forEach((cell, j) => {
				updateCellActiveState(cell, nextStates[i][j]);
			});
		});

	}, 1000);
	 
	const animate = () => {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	};
	
	animate();
}

run();