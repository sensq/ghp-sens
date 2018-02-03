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

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(0, 0, 100);
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
	light.position = new THREE.Vector3(20, 0, 40);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(20, 0, 40);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x888888);
	scene.add(ambient);
}

function mkctx(str){
	canvas.style.backgroundColor = '#99ccff';
	var canv = document.createElement('canvas');
	canv.width = 512;
	canv.height = 256;
	var ctx = canv.getContext('2d');
	ctx.textAlign = 'center';
	ctx.fillStyle = 'blue';
	ctx.font = "33px メイリオ";
	ctx.fillText(str, 256, 64);
	ctx.fillStyle = 'green';
	ctx.font = "55px メイリオ";
	ctx.fillText(str, 256, 128);
	ctx.fillStyle = 'red';
	ctx.font = "33px メイリオ";
	ctx.fillText(str, 256, 192);
	ctx.fillStyle = 'blue';
	ctx.font = "33px メイリオ";
	ctx.fillText(str, 254, 190);
	
	var texture = new THREE.Texture(canv);
	texture.needsUpdate = true;
	
	geoText = new THREE.CubeGeometry(15, 5, 15);
	matText = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		side: 2,
		metal: true
	});
	meshText = new THREE.Mesh(geoText, matText);
	meshText.position = new THREE.Vector3(0, 30, 0);
	scene.add(meshText);
	
	meshText2 = new THREE.Mesh(geoText, matText);
	meshText2.position = new THREE.Vector3(0, -30, 0);
	scene.add(meshText2);
	
	geometry = new THREE.SphereGeometry(30, 30, 30);
	material = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		side: 2,
		map: texture,
		metal: true
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	mesh.rotation.y = -0.5 * (+new Date() - baseTime) / 1000; //回転
	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	mkctx('THREE.js');
	renderer.clear();
	render();
}

function Button_ctx() {
	initScene();
	initLight();
	str = document.getElementById("CTX").value;
	mkctx(str);
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
	var element = document.getElementById("CTX"); 
	element.focus();
	
	document.getElementById("CTX").value = "THREE.js";
}, false);
