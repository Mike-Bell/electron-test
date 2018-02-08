const THREE = require('three');

const run = () => {
	var camera, scene, renderer;
	var geometry, material, mesh;
	 
	const init = () => {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
		camera.position.z = 1;
	 
		scene = new THREE.Scene();
	 
		geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		material = new THREE.MeshNormalMaterial();
	 
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	 
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		window.document.body.appendChild(renderer.domElement);
		
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);
	}
	 
	const animate = () => {
		requestAnimationFrame(animate);
	 
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
	 
		renderer.render(scene, camera);
	};
	
	init();
	animate();
}

run();