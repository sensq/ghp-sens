document.write('<script type="text/javascript" src="./myTemplate.js"></script>');

// グローバル変数
var horizon = 18;
var vertical = 16;
var init = true;
var startTime = new Date();
var moving = true;	// アニメーション中はキー入力無効にする

//衝突判定用のフラグ初期設定（兼リセット）
function initCollision(){
	var i, j;
	flag_collision = new Array(horizon);
	for (i = 0; i < flag_collision.length; i++) {
		flag_collision[i] = new Array(vertical);
		for (j = 0; j < flag_collision[i].length; j++) {
			flag_collision[i][j] = false;
		}
	}
}

//壁を設置
function setWall(x, y){
	var textureWall = setTexture('./metal.jpg');
	var i,j;
	i = x - horizon/2;
	j = y - vertical/2;
	
	//壁用オブジェ
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	// var geometry = new THREE.PlaneGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: 0x0000cc,
		map: textureWall
	});
	mesh_wall = new THREE.Mesh(geometry, material);
	mesh_wall.position = new THREE.Vector3(i, j, 1);
	scene.add(mesh_wall);
	
	flag_collision[x][y] = true;
}

function initWall(){
	var i, j;
	//外枠
	for(i=0; i<horizon; i++){
		setWall(i, vertical-1);
	}
	for(j=2; j<vertical-1; j++){
		setWall(horizon-1, j);
	}
	for(i=0; i<horizon; i++){
		setWall(i, 0);
	}
	for(j=2; j<vertical-1; j++){
		setWall(0, j);
	}
	//内側
	for(j=1; j<vertical-2; j++){
		setWall(3, j);
	}
	for(i=3; i<horizon-2; i++){
		setWall(i, vertical-3);
	}
	for(i=5; i<horizon-2; i++){
		setWall(i, vertical-5);
	}
	for(j=2; j<vertical-5; j++){
		setWall(8, j);
	}
	for(j=2; j<vertical-7; j++){
		setWall(13, j);
	}
	for(i=10; i<horizon-5; i++){
		setWall(i, vertical-7);
	}
	
	setWall(1, 2);
	setWall(2, 4);
	setWall(1, 6);
	setWall(2, 8);
	setWall(2, 9);
	setWall(2, 10);
	setWall(1, 12);
	setWall(1, 13);
	setWall(1, 14);
	setWall(15, 10);
	setWall(16, 3);
	setWall(14, 3);
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	// 光源
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		30 + radius * Math.sin(omega * 0.5 * Math.PI / 180),
		10,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;

	var texturePlayer = setTexture('./sprite0.jpg');
	var textureSkybox = setTexture('./sphere.jpg');
	if(init){
		initCollision();
		initWall();
	}
	// スカイボックス
	var sky = new myObj.skyboxCube();
	scene.add(sky);
	sky.material.color.setHex(0x33ff33);
	// sky.material.map = textureSkybox;

	// 地面
	var floor = new myObj.segmentPlane(horizon, vertical, 0x006600, 0x660000);
	scene.add(floor.mesh);
	floor.mesh.position.x = -0.5;
	floor.mesh.position.y = -0.5;
	floor.mesh.position.z = 0.499;

	// オブジェクト
	var geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 30, 30, 6, 5, 3);
	var material = new THREE.MeshPhongMaterial({
		color: 0xff6600,
	});
	var obj = new THREE.Mesh(geometry, material);
	scene.add(obj);
	var x = -horizon/2+4.5;
	var y = -vertical/2+1.5;
	obj.position = new THREE.Vector3(x, y, 1.2);
	flag_collision[4][1] = true;
	flag_collision[5][1] = true;
	flag_collision[4][2] = true;
	flag_collision[5][2] = true;

	// 動かせるオブジェクト
	var geometry = new THREE.SphereGeometry(0.5, 10, 10);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		map: texturePlayer
	});
	player = new THREE.Mesh(geometry, material);
	// player.position = new THREE.Vector3(-horizon/2+6, -vertical/2+6, 1);
	player.position = new THREE.Vector3(-horizon/2-1, -vertical/2+1, 1);
	scene.add(player);

	// カメラ用ダミー
	var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffff00,
	});
	cameraTarget = new THREE.Mesh(geometry, material);
	cameraTarget.translateX(1);
	cameraTarget.position = player.position.clone();

	// デフォルトのカメラの姿勢
	camera.up = new THREE.Vector3(0, 0, 1)
	camera.rotation.x = Math.PI/180*90;
	camera.rotation.y = -Math.PI/180*90;
	initMapCamera();
};

function initMapCamera(){
	mapCamera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	// カメラの位置
	mapCamera.position = new THREE.Vector3(0, 0, 25);
	// 向いている方向
	mapCamera.lookAt(scene.position)
	// aspect比修正
	mapCamera.aspect = (0.25*Width)/(0.25*Height);
	mapCamera.updateProjectionMatrix();
}

function updateCamera(){
	// カメラをPlayerの後ろに移動
	cameraTarget.position = player.position.clone();
	cameraTarget.rotation.x = player.rotation.x;
	cameraTarget.rotation.y = player.rotation.y;
	cameraTarget.rotation.z = player.rotation.z;
	cameraTarget.translateX(-1);
	camera.position = cameraTarget.position;
}

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	updateCamera();

	// if(player.position.x + horizon/2 == 15 && player.position.y + vertical/2 == 3){
	// 	setWall(15, 3)
	// 	player.position.y = 5 - vertical/2;
	// }

	if(player.position.x == (17 - horizon/2) && player.position.y == (1 - vertical/2)){
		var tempTime = new Date();
		var goalTime = ((tempTime.getTime() - startTime.getTime())/1000).toFixed(2);
		var lap = "";
		lap = 'Goal Time "' + goalTime + "'";
		player.position.x = 18 - horizon/2;
		alert(lap);
	}

	renderer.setViewport(0, 0, Width, Height);
	renderer.enableScissorTest(true);
	renderer.clear();

	var Screen = function(){};
	// 主観視点
	Screen.left = 0;
	Screen.bottom = 0;
	Screen.width = Width;
	Screen.height = Height;
	renderer.setViewport(Screen.left, Screen.bottom, Screen.width, Screen.height);
	renderer.setScissor(Screen.left, Screen.bottom, Screen.width, Screen.height);
	renderer.render(scene, camera);

	// 俯瞰視点
	Screen.left = 0.75*Width;
	Screen.bottom = 0.75*Height;
	Screen.width = 0.25*Width;
	Screen.height = 0.25*Height;
	renderer.setViewport(Screen.left, Screen.bottom, Screen.width, Screen.height);
	renderer.setScissor(Screen.left, Screen.bottom, Screen.width, Screen.height);
	renderer.render(scene, mapCamera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(18, 7, 20);	// カメラ初期化
	initScene();	// シーン初期化
	initLight();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

//========================
// ここからはボタンなどに関する記述
//========================

/*
** 個別にイベントを実行する関数を集めたクラス
*/
var updateObject = function (){};
updateObject.random = function(){
	init = false;
	initCollision();
	updateScene();
	var i, j;
	//外枠
	for(i=0; i<horizon; i++){
		setWall(i, vertical-1);
	}
	for(j=2; j<vertical-1; j++){
		setWall(horizon-1, j);
	}
	for(i=0; i<horizon; i++){
		setWall(i, 0);
	}
	for(j=2; j<vertical-1; j++){
		setWall(0, j);
	}
	//内側
	for(i=0; i<25; i++){
		var x = Math.floor(Math.random()*(horizon-2)) + 1;
		var y = Math.floor(Math.random()*(vertical-2)) + 1;
		setWall(x, y);
	}
	startTime = new Date();
}

//===========================
// ここからはその他のイベントに関する記述
//===========================

/*
** マウス移動時のイベント
*/
document.addEventListener('mousemove', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// 衝突したオブジェクトを取得
	var intersects = getIntersects(mouseX, mouseY);

	/* ここからイベント実装 */
}, false);

/*
** マウスクリック時のイベント（正確には離した時））
*/
document.addEventListener('click', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// 衝突したオブジェクトを取得
	var intersects = getIntersects(mouseX, mouseY);

	/* ここからイベント実装 */
}, false);

/*
** キーボード押下時のイベント
*/
document.onkeydown = function(e) { 
	var ctrl = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
	var shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;

	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};

	// Tweenアニメーション
	var tmpX, tmpY;
	function walk() {
		moving = false;
		var tween = new TWEEN.Tween({ x: player.position.x, y: player.position.y })
			.to( { x: tmpX, y:tmpY }, 300 )
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				player.position.x = this.x;
				player.position.y = this.y;
			})
			.onComplete(function(){
				moving = true;
			})
			.start();
	}
	function rot(direct) {
		moving = false;
		var rotP = player.rotation.z+direct*Math.PI/180*90;
		var rotC = camera.rotation.y+direct*Math.PI/180*90;
		var tween = new TWEEN.Tween({ Player: player.rotation.z, Camera: camera.rotation.y })
			.to( { Player: rotP, Camera: rotC }, 200 )
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				player.rotation.z = this.Player;
				camera.rotation.y = this.Camera;
			})
			.onComplete(function(){
				moving = true;
			})
			.start();
	}
	function animate() {
		requestAnimationFrame( animate );
		TWEEN.update();
	}

	switch(keycode){
		case 37:	// left
		// player.rotation.z += Math.PI/180*90;
		// camera.rotation.y += Math.PI/180*90;
		if(moving){
			rot(1);
			animate();
		}
		break;	

		case 38:	// up
		// player.translateX(1)
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateX(-1)
		// }
		if(moving){
			player.translateX(1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateX(-1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateX(-1);
				walk();
				animate();
			}
		}
		break;

		case 39:	// right
		// player.rotation.z -= Math.PI/180*90;
		// camera.rotation.y -= Math.PI/180*90;
		if(moving){
			rot(-1);
			animate();
		}
		break;

		case 40:	// down
		// player.translateX(-1);
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateX(1);
		// }
		if(moving){
			player.translateX(-1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateX(1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateX(1);
				walk();
				animate();
			}
		}
		break;

		case "A":	// left
		// player.rotation.z += Math.PI/180*90;
		// camera.rotation.y += Math.PI/180*90;
		if(moving){
			rot(1);
			animate();
		}
		break;	

		case "W":	// up
		// player.translateX(1);
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateX(-1);
		// }
		if(moving){
			player.translateX(1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateX(-1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateX(-1);
				walk();
				animate();
			}
		}
		break;

		case "D":	// right
		// player.rotation.z -= Math.PI/180*90;
		// camera.rotation.y -= Math.PI/180*90;
		if(moving){
			rot(-1);
			animate();
		}
		break;

		case "S":	// down
		// player.translateX(-1);
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateX(1);
		// }
		if(moving){
			player.translateX(-1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateX(1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateX(1);
				walk();
				animate();
			}
		}
		break;

		case "Q":	// slide-left
		// player.translateY(1);
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateY(-1);
		// }
		if(moving){
			player.translateY(1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateY(-1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateY(-1);
				walk();
				animate();
			}
		}
		break;

		case "E":	// slide-right
		// player.translateY(-1);
		// if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
		// 	player.translateY(1);
		// }
		if(moving){
			player.translateY(-1);
			if(flag_collision[player.position.x + horizon/2][player.position.y + vertical/2]){
				player.translateY(1);
			}else{
				tmpX = player.position.x;
				tmpY = player.position.y;
				player.translateY(1);
				walk();
				animate();
			}
		}
		break;

		case "Z":
		changeScreen();
		break;
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
}, false);