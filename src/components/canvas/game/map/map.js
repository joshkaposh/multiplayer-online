import * as THREE from "three";

export default class Map {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(600, 400);
		this.renderer.domElement.setAttribute("id", "THREEcanvas");
		document.body.appendChild(this.renderer.domElement);

		this.boxGeometry = new THREE.BoxGeometry();
		this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.cube = new THREE.Mesh(this.boxGeometry, this.material);

		this.sceneWidth = 600;
		this.sceneHeight = 400;
		this.numOfLines = 10;
		this.cellWidth = this.sceneWidth / this.numOfLines;
		this.cellHeight = this.sceneHeight / this.numOfLines;
	}

	makeLine(x, y, z) {
		return new THREE.Vector3(x, y, z);
	}

	makePlane() {
		const geometry = new THREE.PlaneGeometry(25, 25, 25, 25);
		const material = new THREE.MeshBasicMaterial({
			color: "red",
			side: THREE.DoubleSide,
		});
		const plane = new THREE.Mesh(geometry, material);
		this.scene.add(plane);
	}

	addLines() {
		const width = this.sceneWidth;
		const height = this.sceneHeight;
		const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		const meshes = [];
		const horizontalLines = [];
		const verticalLines = [];
		for (let i = 0; i < this.numOfLines; i++) {
			horizontalLines[i] = [[], []];
			verticalLines[i] = [[], []];

			horizontalLines[i][0].push(
				this.makeLine(i * this.cellWidth, height, 0)
			);
			horizontalLines[i][0].push(
				this.makeLine(i * this.cellWidth, -height, 0)
			);
			horizontalLines[i][1].push(
				this.makeLine(-i * this.cellWidth, height, 0)
			);
			horizontalLines[i][1].push(
				this.makeLine(-i * this.cellWidth, -height, 0)
			);

			verticalLines[i][0].push(
				this.makeLine(-width, i * this.cellHeight, 0)
			);
			verticalLines[i][0].push(
				this.makeLine(width, i * this.cellHeight, 0)
			);
			verticalLines[i][1].push(
				this.makeLine(-width, -i * this.cellHeight, 0)
			);
			verticalLines[i][1].push(
				this.makeLine(width, -i * this.cellHeight, 0)
			);
		}
		for (let i = 0; i < this.numOfLines; i++) {
			const vPoints = horizontalLines[i];
			const hPoints = verticalLines[i];

			for (let j = 0; j < hPoints.length; j++) {
				const hGeometry = new THREE.BufferGeometry().setFromPoints(
					hPoints[j]
				);
				const vGeometry = new THREE.BufferGeometry().setFromPoints(
					vPoints[j]
				);
				const lineH = new THREE.Line(hGeometry, material);
				const lineV = new THREE.Line(vGeometry, material);
				const singleGeometry = new THREE.BufferGeometry();
				singleGeometry.merge(hGeometry, 0);
				singleGeometry.merge(vGeometry, 1);
				const mesh = new THREE.Mesh(singleGeometry, material);
				this.scene.add(mesh);
				// this.scene.add(lineV);
				// this.scene.add(lineH);
			}
		}

		// this.addGrid();

		this.camera.position.set(0, 0, 500);
		this.camera.lookAt(0, 0, 0);

		console.log(horizontalLines);
		console.log(verticalLines);
	}

	addGrid() {
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			-5.0,
			-5.0,
			5.0,
			5.0,
			-5.0,
			5.0,
			5.0,
			5.0,
			5.0,

			5.0,
			5.0,
			5.0,
			-5.0,
			5.0,
			5.0,
			-5.0,
			-5.0,
			5.0,
		]);
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(vertices, 3)
		);
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
	}

	addToScene() {
		// this.scene.add(this.cube);
		this.addLines();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {
		this.draw();
	}
}
