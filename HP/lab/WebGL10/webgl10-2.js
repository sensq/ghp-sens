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
	camera.position = new THREE.Vector3(0, 0, -100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , left);
	controls.enabled = true;
	
	subCamera = new THREE.PerspectiveCamera(60, renderTarget.width / renderTarget.height, 0.1, 5000);
	subCamera.position.z = 150;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	subControls = new THREE.TrackballControls( subCamera , left);
	subControls.enabled = false;
}

//画面初期化
function initScene() {
	scene = new THREE.Scene();
	subScene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(40, 50, -40);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(40, 50, -40);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);
	
	subLight = new THREE.DirectionalLight(0xffffff);
	subLight.position = new THREE.Vector3(0.0, 50.0, 40);
	
	subScene.add(subLight);
}

function mkctx(str){
	var textMergedGeo = new THREE.Geometry();
	var textMesh = new THREE.Mesh(
      new THREE.TextGeometry(str, {
        size: 15, height:2, curveSegments: 20, font: 'helvetiker'
      })
    );
    textMesh.position.set(0, 0, 0);
    textMesh.rotation.set(0, 0, 0);
    THREE.GeometryUtils.merge( textMergedGeo, textMesh );
    
    var textMergedMesh = new THREE.Mesh(
      textMergedGeo,
      new THREE.MeshLambertMaterial( { color: 0x00ffff, ambient: 0x00ffff } )
    );
    subScene.add( textMergedMesh );
	
	geometry = new THREE.SphereGeometry(30, 30, 30);
	material = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		side: 2,
		map: renderTarget,
		metal: true
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	subControls.update();	//マウス操作用
	mesh.rotation.y = -0.5 * (+new Date() - baseTime) / 1000; //回転
	renderer.render(subScene, subCamera, renderTarget);
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
