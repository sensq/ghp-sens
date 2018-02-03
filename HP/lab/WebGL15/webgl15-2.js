var baseTime = +new Date();
var success = 0;
var img_floor = './gray2.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

/*
** 描画領域の設定
*/
function initThree() {
	Width = document.getElementById('container').clientWidth; // div要素のサイズを取得
	Height = document.getElementById('container').clientHeight; // div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('container').appendChild(renderer.domElement);
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
	stats.domElement.style.top = '10px';	// 上からの位置
	document.getElementById('container').appendChild(stats.domElement);
	
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
	camera.position = new THREE.Vector3(-10, 0, 40);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera);
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
	light.position = new THREE.Vector3(20, 20, 30);
	
	light.target.position.copy(scene.position);
	light.castShadow = true;
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -.0001
	resolution = 2500;
	light.shadowMapWidth = light.shadowMapHeight = resolution;
	light.shadowDarkness = .7;
	scene.add(light);
	
	ambient = new THREE.AmbientLight(0xaaaaaa);
	scene.add(ambient);
}

var ctx = function (str, size, height){
	var textGeo = new THREE.Geometry();
	var textMesh = new THREE.Mesh(
      new THREE.TextGeometry(str, {
        size: size, height: height, curveSegments: 20, font: 'helvetiker'
      })
    );
    THREE.GeometryUtils.merge( textGeo, textMesh );
    
    this.material = new THREE.MeshPhongMaterial({
		color: 0x006633,
		ambient: 0x666666,
		specular: 0x666666,
		shininess: 90
	});
    this.mesh = new THREE.Mesh(textGeo, this.material);
    this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.rotation.x = -Math.PI/180 * 20;
    return this;
}

/*
** オブジェクトの設定
*/
function initObject() {
	contents = [];
	str = ["HOME", "Twitter", "Blog", "Works", "Google"];
	for(var i=0; i<3; i++){
	    contents[i] = new ctx(str[i], 4, 3);
	    contents[i].mesh.position = new THREE.Vector3(-20, 4-6*i, -20+8*i);
	    scene.add(contents[i].mesh);
	}

	for(var i=3; i<5; i++){
	    contents[i] = new ctx(str[i], 4, 3);
	    contents[i].mesh.position = new THREE.Vector3(0, 4-6*(i-3), -20+8*(i-3));
	    scene.add(contents[i].mesh);
	}

	point_mesh = Array();
	for(i=0; i<2; i++){
		var point_geo = new THREE.SphereGeometry(1, 25, 25);
		var point_mat = new THREE.MeshPhongMaterial({
			color: Math.random() * 0x0ffffff,
			ambient: 0x888888,
			specular: 0xcccccc,
			shininess: 90,
			metal: true
		});
		point_mesh[i] = new THREE.Mesh(point_geo, point_mat);
		point_mesh[i].castShadow = true;
		point_mesh[i].receiveShadow = true;
		scene.add(point_mesh[i]);
	}
	changeColor();

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
	floor_geo = new THREE.PlaneGeometry(70, 70);
	floor_mat = new THREE.MeshPhongMaterial({
		color: 0xaaaaff,
		ambient: 0xaaaaaa,
		specular: 0x888888,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture_floor
	});
	floor_mesh = new THREE.Mesh(floor_geo, floor_mat);
	floor_mesh.rotation.x = -(Math.PI/2.0).toFixed(4);
	floor_mesh.position = new THREE.Vector3(0, -10, -20);
	floor_mesh.castShadow = true;
	floor_mesh.receiveShadow = true;
	scene.add(floor_mesh);
}

function changeColor(){
	point_mesh[0].material.color.setHex(Math.random() * 0xffffff);
	point_mesh[1].material.color.setHex(Math.random() * 0xffffff);
	setTimeout("changeColor()", 1000);
}

/*
** レンダリング
*/
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
	var time = new Date();
	var dt = (time - baseTime);
	var omega = 0.001;
	var amp = 10;
	var rad_a = 30;
	var rad_b = 20;
	point_mesh[0].position.x = rad_a * Math.sin(omega * dt);
	point_mesh[0].position.y = -amp * Math.sin(omega * dt);
	point_mesh[0].position.z = -10 + rad_b * Math.cos(omega * dt);
	point_mesh[1].position.x = rad_a * Math.sin(omega * dt);
	point_mesh[1].position.y = amp * Math.sin(omega * dt);
	point_mesh[1].position.z = -10 + rad_b * Math.cos(omega * dt);

	// 光源回転
	dt = (+new Date() - baseTime);
	var omega = 0.0005;
	var amp = 80;
	light.position = new THREE.Vector3(amp * Math.sin(omega * dt), 80, 10 + amp * Math.cos(omega * dt));
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
	// オブジェクトの引数は[]で括る
	var emissive = 0x666666;
	var intersects = ray.intersectObjects(scene.children);
	// マウスとの衝突判定
	for(var i=0; i<5; i++){
		if(intersects[0].object == contents[i].mesh){
			contents[i].mesh.material.emissive.setHex(emissive);
		}else{
			contents[i].mesh.material.emissive.setHex(0);
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
	// オブジェクトの引数は[]で括る
	var url = ["http://www47.atpages.jp/sensq/home/", 
		"https://twitter.com/s_sensq", 
		"http://www47.atpages.jp/sensq/blog/", 
		"http://www47.atpages.jp/sensq/lab/", 
		"https://www.google.co.jp/", 
	];
	var intersects = ray.intersectObjects(scene.children);
	// クリックしたらリンクを移動
	for(var i=0; i<5; i++){
		if(intersects[0].object == contents[i].mesh){
			window.open(url[i], "_top");
		}
	}
}, false);

/*
** ウィンドウのリサイズに対応
*/
window.addEventListener('resize', function() {
	newWidth = document.getElementById('container').clientWidth;
	newHeight = document.getElementById('container').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);
