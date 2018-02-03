var baseTime = +new Date();
var success = 0;
var start = new Date();
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
	camera.position = new THREE.Vector3(0, 45, 25);
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
	canvas.width = 32; canvas.height = 32;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "white";
	ctx.font = "1000px メイリオ";
	ctx.textAlign = 'center';
	ctx.fillText("■", 256, 580);
	ctx.fillStyle = color;
	ctx.font = "18px メイリオ";
	ctx.textAlign = 'center';
	ctx.fillText(str, 16, 20);
	 
	// テクスチャを作成
	this.texture = new THREE.Texture(canvas);
	this.texture.needsUpdate = true;
	return this;
}

/*
** オブジェクトの設定
*/
function initObject() {
	number = document.getElementsByName("number")[0].value;
	var move = function(){
		var pos = 0;
		if(Math.random()>0.5)
			pos = pos + Math.random() * 15;
		else
			pos = pos + Math.random() * -15;
		return {pos: pos};
	}
	var texture = [];
	for(var i=0; i<number; i++){
		num = String(i);
		texture[i] = new setTexture(num, "red");
	}

	cubeArray = [];
    geometry = new THREE.CubeGeometry(3, 3, 3);
    for(var i = 0; i < number; i++){
        cubeArray[i] = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( {
         	color: 0xff9900,
         	map: texture[i].texture
          } ) );
		cubeArray[i].position = new THREE.Vector3(move().pos, move().pos, 0);
		cubeArray[i].rotation.x = move().pos;
		cubeArray[i].rotation.y = move().pos;
		cubeArray[i].rotation.z = move().pos;
        scene.add(cubeArray[i]);
    }
    cubeArray[0].material.emissive.setHex(0x444444);

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
	// controls.update(); //マウス操作用

	if(success >= 1 && success < number){
		tempTime = new Date();
		nowTime = ((tempTime.getTime() - start.getTime())/1000).toFixed(2);
		document.getElementsByName("time")[0].value = nowTime;
	}else if(success == number){
		success = 0;
		alert(nowTime);
	}
	// 光源回転
	dt = (new Date() - baseTime);
	var omega = 0.0005;
	var amp = 80;
	light.position = new THREE.Vector3(amp * Math.sin(omega * dt), 80, amp * Math.cos(omega * dt));
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
	if(document.getElementsByName("number")[0].value > 1){
		number = document.getElementsByName("number")[0].value;
		success = 0;
		initScene();
		initLight();
		initObject();
		renderer.clear();
		render();
	}
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
	var emissive = 0x000000;

	// マウスとの衝突判定
	for(var i=0; i<number; i++){
		if(intersects[0].faceIndex == i){
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
	if(intersects[0].object == cubeArray[success]){
		cubeArray[success].scale = new THREE.Vector3(0, 0, 0);
		if(success < (number - 1)){
			cubeArray[success + 1].material.emissive.setHex(0x444444);
		}
		success += 1;
		if(success == 1){
			start = new Date();
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
	document.getElementsByName("time")[0].value = 0;
	document.getElementsByName("number")[0].value = 10;
	number = document.getElementsByName("number")[0].value;
	document.getElementsByName("number")[0].focus();
}, false);