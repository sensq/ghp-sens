var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date();
var pauseTime = 0, pause = 1;
var flag = true;

var img1 = './ika.png';
var img2 = './ika.jpg';
texture1 = new THREE.ImageUtils.loadTexture(img1);
texture2 = new THREE.ImageUtils.loadTexture(img2);

//描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight;	//div要素のサイズを取得 
	
	renderer = new THREE.WebGLRenderer({
		clearColor: 0x000000,
		clearAlpha: 1,
		antialias: false
	});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	
	renderTarget = new THREE.WebGLRenderTarget(256, 256, {
		magFilter: THREE.NearestFilter,
		minFilter: THREE.NearestFilter,
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping
	});
};

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(10, 10, 10);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	controls.enabled = false;
	
	subCamera = new THREE.PerspectiveCamera(60, renderTarget.width / renderTarget.height, 0.1, 5000);
	subCamera.position.z = 7;
	subControls = new THREE.TrackballControls( subCamera , canvas);
	subControls.enabled = true;
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
	subScene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0x333333);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	//scene.add(ambient);
	
	subLight1 = new THREE.DirectionalLight(0xffffff);
	subLight1.position = new THREE.Vector3(0.0, 0.0, 1.0);
	subScene.add(subLight1);
	subLight2 = new THREE.DirectionalLight(0xffffff);
	subLight2.position = new THREE.Vector3(0.0, 1.0, 0.0);
	subScene.add(subLight2);
	subLight3 = new THREE.DirectionalLight(0xffffff);
	subLight3.position = new THREE.Vector3(1.0, 0.0, 0.0);
	subScene.add(subLight3);
	subLight4 = new THREE.DirectionalLight(0xffffff);
	subLight4.position = new THREE.Vector3(0.0, 0.0, -1.0);
	subScene.add(subLight4);
	subLight5 = new THREE.DirectionalLight(0xffffff);
	subLight5.position = new THREE.Vector3(0.0, -1.0, 0.0);
	subScene.add(subLight5);
	subLight6 = new THREE.DirectionalLight(0xffffff);
	subLight6.position = new THREE.Vector3(-1.0, 0.0, 0.0);
	subScene.add(subLight6);
	
	subambient = new THREE.AmbientLight(0xffffff);
	scene.add(subambient);
}

//オブジェクトの設定
function initObject() {
	//mesh = new THREE.Mesh(new THREE.TeapotGeometry(15, 20, 1, 0, 1, 1, 1), new THREE.MeshLambertMaterial({
	mesh = new THREE.Mesh(new THREE.CubeGeometry(35, 35, 35), new THREE.MeshLambertMaterial({
	  color: 0xffffff,
	  side: 1,
	  map: renderTarget
	}));
	scene.add(mesh);

	subMesh = new THREE.Mesh(new THREE.CubeGeometry(10,10,10), new THREE.MeshLambertMaterial({
	  color: 0xffffff,
	  side: 1,
	  map: texture1
	}));
	
	subScene.add(subMesh);
	
	subsubMesh = new THREE.Mesh(new THREE.CubeGeometry(1000,1000,1000), new THREE.MeshLambertMaterial({
	  color: 0xffffff,
	  side: 2,
	  map: texture2
	}));
	scene.add(subsubMesh);
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	subControls.update();	//マウス操作用
	renderer.render(subScene, subCamera, renderTarget);
	renderer.render(scene, camera);
	
	switch (pause) {
	case 0:
		break;
	case 1:
		subMesh.rotation.y = 0.15 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		subMesh.rotation.z = 0.15 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		subsubMesh.rotation.x = -0.15 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		subsubMesh.rotation.z = -0.15 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		break;
	}
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

//モード切り替えボタン
function mode() {
	//チェック状態変化用
	var checks=document.getElementsByName("mode");
	
	if(flag == false){
		flag = true;
		checks[0].checked=true;
		subControls.enabled = true;
		controls.enabled = false;
	}
	else if(flag == true){
		flag = false; 
		checks[0].checked = false;
		controls.enabled = true;
		subControls.enabled = false;
	}
}

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

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

document.onkeydown = function(e) { 
	// キーコードの文字を取得 
	keychar = String.fromCharCode(e.which).toUpperCase();
	
	if (keychar == "Q") { 
		mode();
	} else if (keychar == "S") { 
		Button_Startstop();
	}
}

//更新時にチェックボックスのチェックを外す
window.addEventListener('load', function (){
	var checks=document.getElementsByName("mode");
	checks[0].checked=true;
	var checks=document.getElementsByName("Button_Startstop");
	checks[0].checked=false;
	
	checks[0].focus(); // カーソルを合わせる 
}, false);
