var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var dlight_flag = false;
var hlight_flag = false;
var baseTime = +new Date;
var pauseTimex = 0;
var pauseTimey = 0;
var pauseTimez = 0;
var pausex = 0;
var pausey = 0;
var pausez = 0;

//描画領域の設定
function initThree() {
	setInterval(function() {
		stats.begin();
		stats.end();
	}, 1000 / 60);
	Width = document.getElementById('canvas').clientWidth;
	Height = document.getElementById('canvas').clientHeight;
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPSの表示
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('canvas').appendChild(stats.domElement);
}

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(4, 0, 0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(0, 0, 0);
	scene.add(Hemilight);

	ambient = new THREE.AmbientLight(0xdddddd);
	scene.add(ambient);
}

var TempZoom = function(){
	this.up = function(){
		mesh.scale.x += 0.1;
		mesh.scale.y += 0.1;
		mesh.scale.z += 0.1;
	}
	this.down = function(){
		mesh.scale.x -= 0.1;
		mesh.scale.y -= 0.1;
		mesh.scale.z -= 0.1;
	}
	this.default = function(){
		mesh.scale.x = 1;
		mesh.scale.y = 1;
		mesh.scale.z = 1;
	}
};

function initDat(filename,num){
	var Zoom = new TempZoom();
	mesh = new THREE.Object3D(); // 読み込みが完了するまでのダミー
	loader = new THREE.JSONLoader();
	loader.load(filename, function(geometry) {
		mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial);
		mesh.scale = new THREE.Vector3(1, 1, 1);
		mesh.position = new THREE.Vector3(0, 0, 0);
		mesh.rotation = new THREE.Vector3(0.1, 0.1, 0.1)
		
		if(filename=='s05w.js' | filename=='s06w.js'){ //s05w
			geometry.materials[0].ambient = new THREE.Color(0x444488); //フレームの色
		}
		
		for(i=0; i<=num; i++){
			geometry.materials[i].side = 2;
		}
		
		gui1 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
		
		var f11 = gui1.addFolder('図形を回転');
		f11.add(mesh.rotation, 'x' , 0, 6.3).step(0.1).name("X");
		f11.add(mesh.rotation, 'y' , 0, 6.3).step(0.1).name("Y");
		f11.add(mesh.rotation, 'z' , 0, 6.3).step(0.1).name("Z");
		f11.add(Zoom, 'up').name("拡大");
		f11.add(Zoom, 'down').name("縮小");
		f11.add(Zoom, 'default').name("元に戻す");
		f11.open();
		
		gui1.domElement.style.position = 'absolute';
		//gui1.domElement.style.top = '130px';
		gui1.domElement.style.height = '300px';
		document.getElementById('inner-right3').appendChild(gui1.domElement);
		scene.add(mesh);
	});
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	
	//--------
	// 回転用
	//--------
	switch (pausex) {
	case 0:
		document.getElementById("Button_Rotx").innerHTML = "X軸/ON";
		break;
	case 1:
		document.getElementById("Button_Rotx").innerHTML = "X軸/OFF";
		mesh.rotation.x = 0.2 * (new Date() - baseTime + (Date.now() - pauseTimex)) / 1000; //回転
		break;
	}
	
	switch (pausey) {
	case 0:
		document.getElementById("Button_Roty").innerHTML = "Y軸/ON";
		break;
	case 1:
		document.getElementById("Button_Roty").innerHTML = "Y軸/OFF";
		mesh.rotation.y = 0.2 * (new Date() - baseTime + (Date.now() - pauseTimey)) / 1000; //回転
		break;
	}
	
	switch (pausez) {
	case 0:
		document.getElementById("Button_Rotz").innerHTML = "Z軸/ON";
		break;
	case 1:
		document.getElementById("Button_Rotz").innerHTML = "Z軸/OFF";
		mesh.rotation.z = 0.2 * (new Date() - baseTime + (Date.now() - pauseTimez)) / 1000; //回転
		break;
	}
	
	switch (dlight_flag) {
	case false:
		document.getElementById("Button_dLight").innerHTML = "平行ライト/ON";
		light.position.x = 0;
		light.position.y = 0;
		light.position.z = 0;
		break;
	case true:
		document.getElementById("Button_dLight").innerHTML = "平行ライト/OFF";
		light.position.x = 3;
		light.position.y = 3;
		light.position.z = 1;
		break;
	}
	
	switch (hlight_flag) {
	case false:
		document.getElementById("Button_hLight").innerHTML = "半球ライト/ON";
		Hemilight.position.x = 0;
		Hemilight.position.y = 0;
		Hemilight.position.z = 0;
		break;
	case true:
		document.getElementById("Button_hLight").innerHTML = "半球ライト/OFF";
		Hemilight.position.x = 3;
		Hemilight.position.y = 3;
		Hemilight.position.z = 1;
		break;
	}
	
	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initStats();
	initLight();
	initDat('s05.js',3);
	renderer.clear();
	stats.update();
	render();
}

//--------------------
// ライトの擬似ON/OFF
//--------------------
function Button_dLight() {
	switch (dlight_flag) {
	case false:
		dlight_flag = true;
		break;
	case true:
		dlight_flag = false;
		break;
	}
}

function Button_hLight() {
	switch (hlight_flag) {
	case false:
		hlight_flag = true;
		break;
	case true:
		hlight_flag = false;
		break;
	}
}

//-----------------
// 回転用のボタン
//-----------------
function Button_Rotx() {
	switch (pausex) {
	case 0:
		pausex = 1;
		break;
	case 1:
		pausex = 0;
		pauseTimex = Date.now();
		break;
	}
}

function Button_Roty() {
	switch (pausey) {
	case 0:
		pausey = 1;
		break;
	case 1:
		pausey = 0;
		pauseTimey = Date.now();
		break;
	}
}

function Button_Rotz() {
	switch (pausez) {
	case 0:
		pausez = 1;
		break;
	case 1:
		pausez = 0;
		pauseTimez = Date.now();
		break;
	}
}

//--------------------
// 図形の変更
//--------------------
function Button_s05() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s05.js',3);
}

function Button_s05w() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s05w.js',0);
}

function Button_s05x() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s05x.js',0);
}

function Button_s05a() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s05a.js',9);
}

function Button_s06() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s06.js',3);
}

function Button_s06w() {
	initScene();
	initLight();
	document.getElementById("inner-right3").innerHTML = ""
	initDat('s06w.js',0);
}

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//更新時にチェックボックスのチェックを外す
window.addEventListener('load', function (){
	var checks=document.getElementsByName("checkb");
	for(var i=0;i<checks.length;i++){
		checks[i].checked=false;
	}
	checks[0].focus(); // カーソルを合わせる 
}, false);
