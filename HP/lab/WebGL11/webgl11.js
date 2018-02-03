var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = +new Date();

//描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth; //div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight; //div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPSの表示
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';	//上からの位置
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(100, 20, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

//画面初期化
function initScene() {
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x666666);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject(filename, num) {
	loader = new THREE.JSONLoader();
	loader.load(filename, function(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		mesh = new THREE.SkinnedMesh(geometry, material);
		mesh.scale = new THREE.Vector3(13, 13, 13);
		mesh.position = new THREE.Vector3(0, -10, 0);
		mesh.rotation = new THREE.Vector3(0, 90, 0);
		for(i=0; i<=num; i++){
			materials[i].side = 2;
		}
		scene.add(mesh);
	});
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	//mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //回転
	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initStats();
	initCamera();
	initScene();
	initLight();
	initObject('zatsu.js', 3);
	renderer.clear();
	render();
}

function Button(filename, num) {
	initScene();
	initLight();
	initObject(filename, num);
}

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

//フォーカスを合わせる
window.addEventListener('load', function (){
	var select=document.getElementsByName("model");
	select[0].selected = true;
	select.focus();
}, false);
