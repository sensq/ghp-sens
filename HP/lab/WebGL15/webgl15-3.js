var baseTime = +new Date();
var success = 0;
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
	camera.position = new THREE.Vector3(20, 45, 25);
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
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -.0001
	resolution = 2048;
	light.shadowMapWidth = light.shadowMapHeight = resolution;
	light.shadowDarkness = .7;
	scene.add(light);
	
	ambient = new THREE.AmbientLight(0xaaaaaa);
	scene.add(ambient);
}

var setTexture = function(str, color){
	// テクスチャを描画
	canvas = document.createElement('canvas');
	canvas.width = 512; canvas.height = 512;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "white";
	ctx.font = "1000px メイリオ";
	ctx.textAlign = 'center';
	ctx.fillText("■", 256, 580);
	ctx.fillStyle = color;
	ctx.font = "130px メイリオ";
	ctx.textAlign = 'center';
	ctx.fillText(str, 256, 256);
	 
	// テクスチャを作成
	this.texture = new THREE.Texture(canvas);
	this.texture.needsUpdate = true;
	return this;
}

/*
** オブジェクトの設定
*/
function initObject() {
	var texture = [];
	texture[0] = new setTexture("Home", "red");
	texture[1] = new setTexture("Twitter", "green");
	texture[2] = new setTexture("Blog", "blue");
	texture[3] = new setTexture("Works", "yellow");
	texture[4] = new setTexture("Google", "purple");
	texture[5] = new setTexture("pixiv", "cyan");

	var materials = [
		new THREE.MeshPhongMaterial({color:0xff0000, side:2, map:texture[0].texture}),
		new THREE.MeshPhongMaterial({color:0x00ff00, side:2, map:texture[1].texture}),
		new THREE.MeshPhongMaterial({color:0x0000ff, side:2, map:texture[2].texture}),
		new THREE.MeshPhongMaterial({color:0xffff00, side:2, map:texture[3].texture}),
		new THREE.MeshPhongMaterial({color:0xff00ff, side:2, map:texture[4].texture}),
		new THREE.MeshPhongMaterial({color:0x00ffff, side:2, map:texture[5].texture})
	];
	material = new THREE.MeshFaceMaterial(materials);
	geometry = new THREE.CubeGeometry(15, 15, 15);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position = new THREE.Vector3(0, 0, 0);
	
	scene.add(mesh);

	// スカイボックス
	sky_geo = new THREE.SphereGeometry(2000, 25, 25);
	sky_mat = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaff,
		specular: 0x000000,
		shininess: 90,
		metal: true,
		side: 2
	});
	sky_mesh = new THREE.Mesh(sky_geo, sky_mat);
	scene.add(sky_mesh);
	
	// 床
	floor_geo = new THREE.PlaneGeometry(50, 50);
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
	// scene.add(floor_mesh);
}

/*
** レンダリング
*/
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用

	// 光源回転
	dt = (+new Date() - baseTime);
	var omega = 0.0005;
	var amp = 80;
	if(!document.getElementsByName("off")[0].checked){
		light.position = new THREE.Vector3(amp * Math.sin(omega * dt), 80, amp * Math.cos(omega * dt));
		mesh.rotation.x = 2*omega*dt;
		mesh.rotation.z = 2*omega*dt;
	}
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
	success = 0;
	if(document.getElementsByName("off")[0].checked)
		renderer.shadowMapEnabled = false;
	else
		renderer.shadowMapEnabled = true;
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

/*
** 任意の要素のオフセットを取得用関数 (あとで canvas のオフセット位置取得用)
*/
var getElementPosition = function(element) {
        var top = left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
}

/*
** マウス座標を取得して重なったら移動する
*/
var mouseX = -1, mouseY = -1;
document.addEventListener('mousemove', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;

	// Ray用
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	var intersects = ray.intersectObjects(scene.children);

	// ここからメインの実装内容
	var emissive = 0x333333;
	var url = ["https://dl.dropboxusercontent.com/u/36752651/HP/home/index.html", 
		"https://twitter.com/s_sensq", 
		"http://www47.atpages.jp/sensq/blog/", 
		"https://dl.dropboxusercontent.com/u/36752651/HP/lab/top2.html", 
		"https://www.google.co.jp/", 
		"http://www.pixiv.net/",
	];

	// マウスとの衝突判定
	for(var i=0; i<6; i++){
		if(intersects[0].faceIndex == (2*i) || intersects[0].faceIndex == (2*i+1)){
			document.getElementsByName("faceIndex")[0].value = url[i];
			mesh.material.materials[i].emissive.setHex(emissive);
		}else{
			mesh.material.materials[i].emissive.setHex(0);
		}
	}
}, false);

/*
** クリックした座標が重なっていたら消える
*/
document.addEventListener('click', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;

	// Ray用
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	var intersects = ray.intersectObjects(scene.children);

	// ここからメインの実装内容
	var url = ["https://dl.dropboxusercontent.com/u/36752651/HP/home/index.html", 
		"https://twitter.com/s_sensq", 
		"http://www47.atpages.jp/sensq/blog/", 
		"https://dl.dropboxusercontent.com/u/36752651/HP/lab/top2.html", 
		"https://www.google.co.jp/", 
		"http://www.pixiv.net/",
	];

	for(var i=0; i<6; i++){
		if(intersects[0].faceIndex == (2*i) || intersects[0].faceIndex == (2*i+1)){
			document.getElementsByName("faceIndex")[0].value = url[i];
			window.open(url[i], "_top");
		}
	}
}, false);

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
	document.getElementsByName("off")[0].checked = false;
	document.getElementsByName("set")[0].focus();
}, false);