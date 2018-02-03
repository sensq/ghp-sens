document.write('<script type="text/javascript" src="./myTemplate.js" charset="utf-8"></script>');

// 衝突判定用
var world;
var physBody = [];	// 判定を入れる配列
var physMesh = [];	// Meshを入れる配列

// 一時的な変数
var moving = true;	// 移動アニメーションの重複を防ぐ
var rotX = 0;
var rotY = 0;

var myCollider = function(){};
// 有限平面のコライダー
myCollider.Plane = function(xSize, ySize){
	return new CANNON.ConvexPolyhedron(
		[	// vertices
			new CANNON.Vec3(-xSize/2,  ySize/2, 0),
			new CANNON.Vec3( xSize/2,  ySize/2, 0),
			new CANNON.Vec3( xSize/2, -ySize/2, 0),
			new CANNON.Vec3(-xSize/2, -ySize/2, 0)
		],
		[	// Faces
			[3,2,1,0]
		],
		[	// Normals
			new CANNON.Vec3(0,0,1)
		]
	);
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	// スカイボックスと床
	var sky = new myObj.skyboxSphere();
	scene.add(sky);

	// オブジェクトを配置する世界
	world = new CANNON.World();
	world.gravity.set(0, 0, -5);	// 重力の方向と強さ
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 2;
	world.allowSleep = true;
	
	// 広さ無限の平面
	// var globalShape = new CANNON.Plane(new CANNON.Vec3(0, 0, 1));	// 上方向を指定
	// globalBody = new CANNON.RigidBody(0, globalShape);
	// globalBody.position.z = -5;
	// world.add(globalBody);
	// var globalGeometry = new THREE.PlaneGeometry(200, 200);
	// var globalMaterial = new THREE.MeshBasicMaterial({
	// 	color: 0xeeeeee
	// });
	// var globalMesh = new THREE.Mesh(globalGeometry, globalMaterial);
	// scene.add(globalMesh);
	// globalMesh.position.z = -10;

	// 平面
	var xSize = ySize = 10;
	var groundShape = new myCollider.Plane(xSize, ySize);
	groundBody = new CANNON.RigidBody(0, groundShape);
	groundBody.quaternion.y = Math.PI/180*10;
	world.add(groundBody);
	groundMesh = new myObj.segmentPlane(xSize, ySize);
	scene.add(groundMesh.mesh);
	groundBody.quaternion.copy(groundMesh.mesh.quaternion);
	var Axis = groundBody.quaternion.toAxisAngle(Axis);
	document.getElementById('theta').value = parseInt(Axis[1]*180/Math.PI);

	// キューブ
	var cubeSize = 1;
	var halfExtents = new CANNON.Vec3(cubeSize/2, cubeSize/2, cubeSize/2);	// 中央からの距離
	var cubeShape = new CANNON.Box(halfExtents);
	var cubeBody = new CANNON.RigidBody(1, cubeShape);
	cubeBody.allowSleep = true;
	cubeBody.sleepSpeedLimit = 0.1;
	var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
	var cubeMaterial = new THREE.MeshLambertMaterial({
		color: Math.random() * 0xffffff
	});
	cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubeBody.position = new CANNON.Vec3(-3, 4, 2);
	physBody.push(cubeBody);
	physMesh.push(cubeMesh);
	world.add(cubeBody);
	scene.add(cubeMesh);
	cubeMesh.useQuaternion = true;
	
	// スフィア
	var sphereSize = 1;
	var sphereShape = new CANNON.Sphere(sphereSize);
	var sphereBody = new CANNON.RigidBody(1, sphereShape);
	sphereBody.allowSleep = true;
	sphereBody.sleepSpeedLimit = 0.1;
	var sphereGeometry = new THREE.SphereGeometry(sphereSize, 20, 20);
	var sphereMaterial = new THREE.MeshLambertMaterial({
		color: Math.random() * 0xffffff
	});
	var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereBody.position = new CANNON.Vec3(0, 0, 2);
	physBody.push(sphereBody);
	physMesh.push(sphereMesh);
	world.add(sphereBody);
	scene.add(sphereMesh);
	sphereMesh.useQuaternion = true;
	
	// 大量にキューブか球を降らす
	for(var i = 0; i < 20; i++){
		var shape, body, geometry, material, mesh;
		var p = 0.8*Math.random() + 0.2;
		if(p > 0.6){
			halfExtents = new CANNON.Vec3(p*cubeSize/2, p*cubeSize/2, p*cubeSize/2);
			shape = new CANNON.Box(halfExtents);
			geometry = new THREE.CubeGeometry(p*cubeSize, p*cubeSize, p*cubeSize);
		}else{
			shape = new CANNON.Sphere(p*sphereSize);
			geometry = new THREE.SphereGeometry(p*sphereSize, 20, 20);
		}
		material = new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff
		});
		mesh = new THREE.Mesh(geometry, material);
		body = new CANNON.RigidBody(0.5, shape);
		body.allowSleep = true;
		body.sleepSpeedLimit = 0.1;

		// Physics
		var randX = (Math.round(Math.random() * 9) + 1 - 5) * .2;
		var randY = (Math.round(Math.random() * 9) + 1 - 5) * .2;
		
		// start pos
		var pos = new CANNON.Vec3(0, 0, i * 4 + 4);
		body.position = new CANNON.Vec3(pos.x + randX, pos.y + randY, pos.z);
		
		// Save initial positions for later
		physBody.push(body);
		physMesh.push(mesh);
		world.add(body);
		scene.add(mesh);
		mesh.useQuaternion = true;
	}
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//マウス操作用

	// 光源
	Hemilight.position = new THREE.Vector3(20, -20, 70);
	light.position = Hemilight.position;

	document.getElementById('number').value = physBody.length;

	// 物体のメッシュの位置をコライダーの位置に従わせる
	if(!world.paused){
		world.step(1.0 / 60.0);
		for(var i = 0, l = physBody.length; i < l; i++){
			physBody[i].position.copy(physMesh[i].position);
			physBody[i].quaternion.copy(physMesh[i].quaternion);
		}
	}

	// 何かに衝突したら色が変わる
	for(var i = 0, l = physBody.length; i < l; i++){
		changeColor(i);
	}

	keyControl();
	renderer.render(scene, camera);
};

function changeColor(num){
	physBody[num].addEventListener("collide", function(e) {
		var color = Math.random() * 0xffffff;
		physMesh[num].material.color.setHex(color);
	});
	if(physMesh[num].position.z < -10){
		// scene.remove(physMesh[num]);
	}
}

/*
** キーボード入力
*/
function keyControl(){
	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
	}

	// 床を傾ける
	if (keyboard.pressed("left")){
		var Axis = groundBody.quaternion.toAxisAngle(Axis);
		Axis[1] -= Math.PI/180*1;
		if(Axis[1] < 0)
			Axis[1] += 2*Math.PI;
		groundBody.quaternion.setFromAxisAngle(Axis[0], Axis[1]);
		groundBody.quaternion.copy(groundMesh.mesh.quaternion);
		document.getElementById('theta').value = parseInt(Axis[1]*180/Math.PI);
	}
	if (keyboard.pressed("right")){
		var Axis = groundBody.quaternion.toAxisAngle(Axis);
		Axis[1] += Math.PI/180*1;
		if(Axis[1] > 2*Math.PI)
			Axis[1] -= 2*Math.PI;
		groundBody.quaternion.setFromAxisAngle(Axis[0], Axis[1]);
		groundBody.quaternion.copy(groundMesh.mesh.quaternion);
		document.getElementById('theta').value = parseInt(Axis[1]*180/Math.PI);
	}
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(0, -10, 10);	// カメラ初期化
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
// キューブor球を生成
updateObject.add = function(flag){
	var p = 0.8*Math.random() + 0.2;
	if(flag === "cube"){
		var cubeSize = 1;
		var halfExtents = new CANNON.Vec3(p*cubeSize/2, p*cubeSize/2, p*cubeSize/2);
		var shape = new CANNON.Box(halfExtents);
		var geometry = new THREE.CubeGeometry(p*cubeSize, p*cubeSize, p*cubeSize);
	}else if(flag === "sphere"){
		sphereSize = 1;
		shape = new CANNON.Sphere(p*sphereSize);
		geometry = new THREE.SphereGeometry(p*sphereSize, 20, 20);
	}
	var material = new THREE.MeshLambertMaterial({
		color: Math.random() * 0xffffff
	});
	var mesh = new THREE.Mesh(geometry, material);
	var body = new CANNON.RigidBody(0.5, shape);
	body.allowSleep = true;
	body.sleepSpeedLimit = 0.1;

	var randX = (Math.round(Math.random() * 9) + 1 - 5) * .2;
	var randY = (Math.round(Math.random() * 9) + 1 - 5) * .2;
	var randZ = (Math.round(Math.random() * 9) + 1 - 5) * .2;
	var pos = new CANNON.Vec3(0, 0, 6);
	body.position = new CANNON.Vec3(pos.x + randX, pos.y + randY, pos.z + randZ);

	physBody.push(body);
	physMesh.push(mesh);
	world.add(body);
	scene.add(mesh);
	mesh.useQuaternion = true;
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
	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};
	switch(keycode){
		case "C":
		updateObject.add('cube');
		break;

		case "S":
		updateObject.add('sphere');
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