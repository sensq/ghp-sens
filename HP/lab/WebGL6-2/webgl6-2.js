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
	light = new THREE.DirectionalLight(0x999999);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x666666,0x333333);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject(filename) {
	mesh = new THREE.Object3D(); // 読み込みが完了するまでのダミー
	var loader = new THREE.OBJLoader();
	loader.load(filename, function(geometry) {
		mesh = geometry;
		
		//サッカーボール
        c = mesh.children[0].geometry.faces;
        len = c.length;
        if(filename === 'obj/s06.obj'){
			for(i=0; i<len; i++){
	          if(i<40){
		          c[i].materialIndex = 0;	//六角形
	          }else{
		          c[i].materialIndex = 1;	//五角形
	          }
	          mesh.children[0].material = new THREE.MeshFaceMaterial([
		          new THREE.MeshLambertMaterial({ color:0xdddddd }),
		          new THREE.MeshLambertMaterial({ color:0x000000 })
				]);
        	}
        //それ以外
    	}else{
			mesh.children[0].material = new THREE.MeshLambertMaterial({ color:0x00bbcc })
		}
        
		mesh.scale = new THREE.Vector3(30, 30, 30);
		scene.add(mesh);
	});
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //回転
	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initObject('obj/s06.obj');
	renderer.clear();
	render();
}

function Button_obj() {
	initScene();
	initLight();
	obj = new String();
	obj = 'obj/' + document.getElementById("OBJ").value + '.obj';
	initObject(obj);
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
	var element = document.getElementById("dummy"); 
	element.focus();
	
	document.getElementById("OBJ").value = "s06";
}, false);
