var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = new Date();

//描画領域の設定
function initThree() {
	// Width = document.getElementById('canvas').clientWidth; //div要素のサイズを取得
	// Height = document.getElementById('canvas').clientHeight; //div要素のサイズを取得 
	Width = document.body.clientWidth; //div要素のサイズを取得
	Height = document.body.clientHeight; //div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	// document.getElementById('canvas').appendChild(renderer.domElement);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColorHex(0xffffff, 1.0);
}

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(10, 0, 10);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera);
}

//画面初期化
function initScene() {
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);
	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject() {
	var geometry = new THREE.Geometry();
	var numParticles = 40000;
	for(var i = 0 ; i < numParticles ; i++) {
	  geometry.vertices.push(new THREE.Vector3(
	    Math.random() * 100-50,
	    Math.random() * 100-50,
	    Math.random() * 100-50));
	}

	var img1 = './miku.png';
	texture1 = new THREE.ImageUtils.loadTexture(img1);

	// マテリアルを作成
	var material = new THREE.ParticleBasicMaterial({
		size: 10,
		transparent: true,
		opacity: 0.7,
		map: texture1,
		color: 0xffffff,
		blending: THREE.NormalBlending,
		depthTest: false,
	});

	// 物体を作成
	mesh = new THREE.ParticleSystem(geometry, material);
	mesh.position = new THREE.Vector3(0, 0, 0);
	mesh.sortParticles = false;
	scene.add(mesh);
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	mesh.rotation.y = 0.3 * (new Date() - baseTime) / 1000; //回転
	mesh.rotation.z = 0.3 * (new Date() - baseTime) / 1000; //回転
	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	// newWidth = document.getElementById('canvas').clientWidth;
	// newHeight = document.getElementById('canvas').clientHeight;
	newWidth = document.body.clientWidth;
	newHeight = document.body.clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

//フォーカスを合わせる
window.addEventListener('load', function (){
	var element = document.getElementById("dummy"); 
	element.focus();
}, false);
