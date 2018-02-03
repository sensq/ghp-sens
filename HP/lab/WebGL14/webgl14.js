var pauseTime = 0;
var baseTime = +new Date();
var img_floor = './gray.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

/*
** 描画領域の設定
*/
function initThree() {
	Width = document.getElementById('canvas').clientWidth; // div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight; // div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	
	// シャドーマッピングON
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
}

/*
** FPSの表示
*/
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '65px';	// 上からの位置
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
}

/*
** カメラの設定
*/
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(20, 75, 110);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

/*
** 画面初期化
*/
function initScene() {
	scene = new THREE.Scene();
}

/*
** 光源の設定
*/
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(60, 80, 0);
	
	light.target.position.copy(scene.position);
	light.castShadow = true;
	if(document.getElementsByName("shadow_vis")[0].checked)
		light.shadowCameraVisible = true;
	//light.shadowCameraLeft = -60;
	//light.shadowCameraRight = 60;
	//light.shadowCameraTop = -60;
	//light.shadowCameraBottom = 60;
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -.0001
	resolution = document.getElementById("resolution").value;
		light.shadowMapWidth = light.shadowMapHeight = resolution;
	light.shadowDarkness = .7;
	scene.add(light);
	
	ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);
}

/*
** オブジェクトの設定
*/
function initObject() {
	// 文字
	if(document.getElementsByName("ctx")[0].checked)
		setctx();
	
	point_mesh = Array();
	for(i=0; i<3; i++){
		var point_geo = new THREE.SphereGeometry(3, 25, 25);
		var point_mat = new THREE.MeshPhongMaterial({
			color: 0x00ff99,
			ambient: 0x888888,
			specular: 0xcccccc,
			shininess: 90,
			side: 2,
			metal: true
		});
		point_mesh[i] = new THREE.Mesh(point_geo, point_mat);
		point_mesh[i].castShadow = true;
		point_mesh[i].receiveShadow = true;
		scene.add(point_mesh[i]);
	}
	
	// 回転体
	var points = [
		new THREE.Vector3(7, 0, 20),
		new THREE.Vector3(12, 0, 20),
		new THREE.Vector3(20, 0, 30),
		new THREE.Vector3(15, 0, 35),
		new THREE.Vector3(12, 0, 35),
	];
	var geometry = new THREE.LatheGeometry(points, 8);
	var material = new THREE.MeshPhongMaterial({color: 0xaa0000, side: 2});
	lathe = new THREE.Mesh(geometry, material);
	lathe.castShadow = true;
	lathe.receiveShadow = true;
	lathe.rotation.x = -(Math.PI/2.0).toFixed(6);
	if(document.getElementsByName("lathe")[0].checked)
		scene.add(lathe);
	
	// スカイボックス
	sky_geo = new THREE.SphereGeometry(2000, 25, 25);
	sky_mat = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaaa,
		specular: 0x000000,
		shininess: 90,
		metal: true,
		side: 2
	});
	sky_mesh = new THREE.Mesh(sky_geo, sky_mat);
	scene.add(sky_mesh);
	
	// 床
	floor_geo = new THREE.PlaneGeometry(100, 100);
	floor_mat = new THREE.MeshPhongMaterial({
		color: 0xaaaaff,
		ambient: 0x888888,
		specular: 0x888888,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture_floor
	});
	floor_mesh = new THREE.Mesh(floor_geo, floor_mat);
	floor_mesh.rotation.x = -(Math.PI/2.0).toFixed(4);
	floor_mesh.position = new THREE.Vector3(0, -10, 0);
	floor_mesh.castShadow = true;
	floor_mesh.receiveShadow = true;
	scene.add(floor_mesh);
}

function mkctx(str, size, height){
	var textGeo = new THREE.Geometry();
	var textMesh = new THREE.Mesh(
      new THREE.TextGeometry(str, {
        size: size, height:height, curveSegments: 20, font: 'helvetiker'
      })
    );
    THREE.GeometryUtils.merge( textGeo, textMesh );
    
    material = new THREE.MeshPhongMaterial({
		color: 0x0099ff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		side: 2,
		metal: true
	});
    var ctx_mesh = new THREE.Mesh(textGeo, material);
    ctx_mesh.position = new THREE.Vector3(-40, 0, 0);
    ctx_mesh.castShadow = true;
	ctx_mesh.receiveShadow = true;
	ctx_mesh.rotation.x = -Math.PI/7;
    scene.add(ctx_mesh);
}

function setctx() {
	initScene();
	initLight();
	str = document.getElementById("CTX").value;
	size = document.getElementById("size").value;
	height = document.getElementById("height").value;
	mkctx(str, size, height);
}

/*
** レンダリング
*/
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	
	if(document.getElementsByName("rot")[0].checked)
		dt2 = (+new Date() - baseTime);
	else
		dt2 = dt2;
	
	var dt = (+new Date() - baseTime);
	var omega = 0.001;
	var amp = 20;
	var rad_a = 30;
	var rad_b = 20;
	point_mesh[0].position.x = amp * (Math.sin(omega * dt) + Math.cos(omega * dt));
	point_mesh[1].position.z = amp * (Math.sin(omega * dt) + Math.cos(omega * dt));
	point_mesh[2].position.x = rad_a * Math.sin(omega * dt);
	point_mesh[2].position.y = amp * Math.sin(omega * dt);
	point_mesh[2].position.z = rad_b * Math.cos(omega * dt);
	
	// 光源回転
	var omega = 0.0005;
	var amp = 80;
	light.position = new THREE.Vector3(amp * Math.sin(omega * dt2), 80, amp * Math.cos(omega * dt2));
	renderer.render(scene, camera);
}

/*
** 実行する関数
*/
function threeStart() {
	initThree();
	initStats();
	initCamera();
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

function set() {
	if(document.getElementsByName("shadow")[0].checked)
		renderer.shadowMapEnabled = true;
	else
		renderer.shadowMapEnabled = false;
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

/*
** ウィンドウのリサイズに対応
*/
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

/*
** デフォルト値代入＋フォーカスを合わせる
*/
window.addEventListener('load', function() {
	document.getElementsByName("shadow")[0].checked = true;
	document.getElementsByName("shadow_vis")[0].checked = true;
	document.getElementsByName("lathe")[0].checked = true;
	document.getElementsByName("rot")[0].checked = true;
	document.getElementsByName("ctx")[0].checked = true;
	document.getElementsByName("shadow")[0].focus();
	
	document.getElementById("resolution").value = 1024;
	
	document.getElementById("CTX").value = "THREE.js";
	document.getElementById("size").value = 15;
	document.getElementById("height").value = 10;
}, false);