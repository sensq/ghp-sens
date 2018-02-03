var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var stats;
var baseTime = +new Date();
var pauseTime = 0, pause = 1;
var flag = true;

//左→下→奥→右→上→正面
var img_nx	= './Bridge2/negx.jpg';
var img_ny	= './Bridge2/negy.jpg';
var img_nz	= './Bridge2/negz.jpg';
var img_px	= './Bridge2/posx.jpg';
var img_py	= './Bridge2/posy.jpg';
var img_pz	= './Bridge2/posz.jpg';

function texture(){
	texture_nx	= new THREE.ImageUtils.loadTexture(img_nx);
	texture_ny	= new THREE.ImageUtils.loadTexture(img_ny);
	texture_nz	= new THREE.ImageUtils.loadTexture(img_nz);
	texture_px	= new THREE.ImageUtils.loadTexture(img_px);
	texture_py	= new THREE.ImageUtils.loadTexture(img_py);
	texture_pz	= new THREE.ImageUtils.loadTexture(img_pz);
}

//描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight;	//div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPSの表示
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '57px';	//上からの位置
	document.getElementById('container').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(0, 0, 1);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light1 = new THREE.DirectionalLight(0xcccccc);
	light1.position = new THREE.Vector3(0, 100, 0);
	light1.intensity = 1.0;
	scene.add(light1);
	
	light2 = new THREE.DirectionalLight(0xcccccc);
	light2.position = new THREE.Vector3(100, 0, 0);
	light2.intensity = 1.0;
	scene.add(light2);
	
	light3 = new THREE.DirectionalLight(0xcccccc);
	light3.position = new THREE.Vector3(0, 0, 100);
	light3.intensity = 1.0;
	scene.add(light3);
	
	light4 = new THREE.DirectionalLight(0xcccccc);
	light4.position = new THREE.Vector3(-100, 0, 0);
	light4.intensity = 1.0;
	scene.add(light4);
	
	light5 = new THREE.DirectionalLight(0xcccccc);
	light5.position = new THREE.Vector3(0, -100, 0);
	light5.intensity = 1.0;
	scene.add(light5);
	
	light6 = new THREE.DirectionalLight(0xcccccc);
	light6.position = new THREE.Vector3(0, 0, -100);
	light6.intensity = 1.0;
	scene.add(light6);

	ambient = new THREE.AmbientLight(0xffffff);
	ambient.position = new THREE.Vector3(0, 0, 0);
	scene.add(ambient);
}

//回転速度
var TempVelocity = function(){
	this.value = 0.2;
};

var Velocity = new TempVelocity();

//オブジェクトの設定
function initObject() {
	texture();
	
	var materials = [
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_px,side:2}),
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_nx,side:2}),
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_py,side:2}),
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_ny,side:2}),
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_pz,side:2}),
		new THREE.MeshLambertMaterial({color: 0x555555,map:texture_nz,side:2})
	];
	material = new THREE.MeshFaceMaterial(materials);
	geometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
	
	mesh = new THREE.Mesh(geometry, material);
	
	scene.add(mesh);
}

function initDat(){
	gui = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
		
	gui.add(Velocity, 'value' , -1.0, 1.0).step(0.1).name("速度");
	
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.top = '10px';
	gui.domElement.style.left = '170px';
	gui.domElement.style.height = '300px';
	document.getElementById('container').appendChild(gui.domElement);
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	
	renderer.render(scene, camera);
	
	switch (pause) {
	case 0:
		break;
	case 1:
		mesh.rotation.y = Velocity.value * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		break;
	}
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initStats();
	initObject();
	initDat();
	renderer.clear();
	render();
}

//ボタンの設定//

function Button_func() {
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

//回転のスタートストップ
function Button_Startstop() {
	switch (pause) {
	case 0:
		pause = 1;
		break;
	case 1:
		pause = 0;
		pauseTime = Date.now();
		break;
	}
}

//内側から見る
function Button_inside() {
	camera.position = new THREE.Vector3(0, 0, 1);
	renderer.clear();
	render();
}

//外側から見る
function Button_outside() {
	camera.position = new THREE.Vector3(200, 0, 0);
	renderer.clear();
	render();
}

//ここからテクスチャの切り替え用
function Button_Bridge() {
	img_nx	= './Bridge2/negx.jpg';
	img_ny	= './Bridge2/negy.jpg';
	img_nz	= './Bridge2/negz.jpg';
	img_px	= './Bridge2/posx.jpg';
	img_py	= './Bridge2/posy.jpg';
	img_pz	= './Bridge2/posz.jpg';
	Button_func()
}

function Button_Escher() {
	img_nx	= './Escher/nx.jpg';
	img_ny	= './Escher/ny.jpg';
	img_nz	= './Escher/nz.jpg';
	img_px	= './Escher/px.jpg';
	img_py	= './Escher/py.jpg';
	img_pz	= './Escher/pz.jpg';
	Button_func()
}

function Button_Park1() {
	img_nx	= './Park2/negx.jpg';
	img_ny	= './Park2/negy.jpg';
	img_nz	= './Park2/negz.jpg';
	img_px	= './Park2/posx.jpg';
	img_py	= './Park2/posy.jpg';
	img_pz	= './Park2/posz.jpg';
	Button_func()
}

function Button_Park2() {
	img_nx	= './Park3Med/nx.jpg';
	img_ny	= './Park3Med/ny.jpg';
	img_nz	= './Park3Med/nz.jpg';
	img_px	= './Park3Med/px.jpg';
	img_py	= './Park3Med/py.jpg';
	img_pz	= './Park3Med/pz.jpg';
	Button_func()
}

function Button_Sky() {
	img_nx	= './skybox/nx.jpg';
	img_ny	= './skybox/ny.jpg';
	img_nz	= './skybox/nz.jpg';
	img_px	= './skybox/px.jpg';
	img_py	= './skybox/py.jpg';
	img_pz	= './skybox/pz.jpg';
	Button_func()
}

function Button_Town1() {
	img_nx	= './pisa/nx.png';
	img_ny	= './pisa/ny.png';
	img_nz	= './pisa/nz.png';
	img_px	= './pisa/px.png';
	img_py	= './pisa/py.png';
	img_pz	= './pisa/pz.png';
	Button_func()
}

function Button_Town2() {
	img_nx	= './SwedishRoyalCastle/nx.jpg';
	img_ny	= './SwedishRoyalCastle/ny.jpg';
	img_nz	= './SwedishRoyalCastle/nz.jpg';
	img_px	= './SwedishRoyalCastle/px.jpg';
	img_py	= './SwedishRoyalCastle/py.jpg';
	img_pz	= './SwedishRoyalCastle/pz.jpg';
	Button_func()
}

function Button_Earth() {
	img_nx	= './Earth/nx.jpg';
	img_ny	= './Earth/ny.jpg';
	img_nz	= './Earth/nz.jpg';
	img_px	= './Earth/px.jpg';
	img_py	= './Earth/py.jpg';
	img_pz	= './Earth/pz.jpg';
	Button_func()
}

function Button_Galaxy() {
	img_nx	= './Galaxy.jpg';
	img_ny	= './Galaxy.jpg';
	img_nz	= './Galaxy.jpg';
	img_px	= './Galaxy.jpg';
	img_py	= './Galaxy.jpg';
	img_pz	= './Galaxy.jpg';
	Button_func()
}

function Button_Gradation() {
	img_nx	= './Gradation/nx.png';
	img_ny	= './Gradation/ny.png';
	img_nz	= './Gradation/nz.png';
	img_px	= './Gradation/px.png';
	img_py	= './Gradation/py.png';
	img_pz	= './Gradation/pz.png';
	Button_func()
}

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//フォーカスを合わせる
window.addEventListener('load', function (){
	var checks=document.getElementsByName("Button_Startstop");
	checks[0].checked=false;
	
	checks[0].focus(); // カーソルを合わせる 
}, false);
