document.write('<script type="text/javascript" src="./myTemplate.js" charset="Shift_JIS"></script>');

var Horizon = 18;	// 床の横幅
var Vertical = 20;	// 床の縦幅
var Num = 0;		// 現在画面内にある弾数
var MaxNum = 3;		// 画面内に出せる最大弾数
var Speed = 100;	// 自機1マス移動にかかる時間[ms]（小さいほど速い）
var MSpeed = 800;	// ミサイルが消えるまでの時間[ms]（小さいほど速い）

// 一時的な変数
var moving = true;	// 移動アニメーションの重複を防ぐ
var score = 0;
var red = 0;
var yellow = 0;
var timer = 0;
var startTime;
var goalTime = 0;

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	// スカイボックスと床
	var sky = new myObj.skyboxSphere();
	scene.add(sky);
	floor = new myObj.segmentPlane(Vertical, Horizon);
	scene.add(floor.mesh);
	floor.mesh.material.color.setHex(0xbbbbbb);
	floor.mesh.rotation.x = Math.PI/180*90;
	floor.mesh.receiveShadow = true;
	// 自機
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: 0x00cccc,
		map: setCtxTexture("自", 0x333333, 200)
	});
	player = new THREE.Mesh(geometry, material);
	player.position = new THREE.Vector3(3.5, 0.5, 0.5);
	player.rotation.z = Math.PI/180*90;
	scene.add(player);
	// 敵
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xcc0000,
		map: setCtxTexture("敵", 0x333333, 200)
	});
	enemy = new THREE.Mesh(geometry, material);
	enemy.position = new THREE.Vector3(-4.5, 0.5, 3.5);
	enemy.rotation.y = Math.PI/180*90;
	scene.add(enemy);
	// レア敵
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xcccc00,
		map: setCtxTexture("れあ", 0x333333, 100)
	});
	rare = new THREE.Mesh(geometry, material);
	rare.position = new THREE.Vector3(Horizon, 0.5, 0.5);
	rare.rotation.y = Math.PI/180*90;
	// エラー防止用のダミー
	missile = [];
	geometry = new THREE.CubeGeometry(0.6, 0.2, 0.2);
	material = new THREE.MeshPhongMaterial({
		color: 0x666666
	});
	for(var i=0; i<MaxNum; i++){
		missile.push(new THREE.Mesh(geometry, material));
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
	if(timer != 0){
		if(timer == 1){
			timer++;
			startTime = new Date();
		}
		var tempTime = new Date();
		goalTime = ((tempTime.getTime() - startTime.getTime())/1000).toFixed(2);
	}
	// 視点
	if(document.getElementById('1st').checked){
		camera.position.x = player.position.x;
		camera.position.y = player.position.y;
		camera.position.z = player.position.z;
		var target = new THREE.Vector3(player.position.x-5, player.position.y+1, player.position.z);
		camera.lookAt(target);
	}else if(document.getElementById('3rd').checked){
		camera.position.x = player.position.x+3;
		camera.position.y = player.position.y+2;
		camera.position.z = player.position.z;
		var target = new THREE.Vector3(player.position.x-5, player.position.y+1, player.position.z);
		camera.lookAt(target);
	}else if(document.getElementById('hukan').checked){
		camera.position.x = 11;
		camera.position.y = 10;
		camera.position.z = 0;
		var target = new THREE.Vector3(2, 0, 0);
		camera.lookAt(target);
	}

	// 光源
	Hemilight.position = new THREE.Vector3(20, 20, 0);
	light.position = Hemilight.position;

	// タイムとスコアの表示
	document.getElementById('time').value = goalTime;
	document.getElementById('score').value = score;
	document.getElementById('red').value = red;
	document.getElementById('yellow').value = yellow;
	// 終了
	if(parseInt(goalTime) == 30){
		var result = "";
		result = score + "点！";
		// 最高記録を保持
		if(score > document.getElementById('record').value){
			document.getElementById('record').value = score;
		}
		timer = 0;
		goalTime = 0;
		alert(result)
		score = 0;
		red = 0;
		yellow = 0;
	}

	keyControl();
	renderer.render(scene, camera);
};

/*
** キーボード入力
*/
function keyControl(){
	function move(direct){
		moving = false;
		// 移動と回転
		var tween = new TWEEN.Tween({ z:player.position.z, rotation:player.rotation.x });
			if(direct == "left"){
				tween.to( { z:player.position.z+1, rotation: player.rotation.x+Math.PI/180*90}, Speed );
			}else if(direct == "right"){
				tween.to( { z:player.position.z-1, rotation: player.rotation.x-Math.PI/180*90}, Speed );
			}
			tween.easing(TWEEN.Easing.Linear.None);
			tween.onUpdate(function () {
				switch(direct){
					case "left":
					player.rotation.x = this.rotation;
					player.position.z = this.z;
					break;
					case "right":
					player.rotation.x = this.rotation;
					player.position.z = this.z;
					break;
				}
				if(document.getElementById('rush').checked){
					Speed = 20;
					MSpeed = 2000;
					fire();
				}else{
					Speed = 100;
					MSpeed = 800;
				}
			});
			tween.onComplete(function(){
				moving = true;
			});
			tween.start();
	}

	// 発射アニメーション
	function fire(){
		if(timer == 0){
			timer++;	// タイマーを作動させるための処理
		}
		var geometry = new THREE.CubeGeometry(0.6, 0.2, 0.2);
		var material = new THREE.MeshPhongMaterial({
			color: 0x666666
		});
		missile[Num] = new THREE.Mesh(geometry, material);
		var currentMissile = missile[Num];
		scene.add(currentMissile);
		Num++;
		var missilePos = {x:player.position.x, y:0.5, z:player.position.z};
		currentMissile.position.y = missilePos.y;
		currentMissile.position.z = missilePos.z;
		var tween = new TWEEN.Tween(missilePos);
		tween.to( { x:-Vertical/2}, MSpeed );
		tween.easing(TWEEN.Easing.Linear.None);
		tween.onUpdate(function () {
			player.material.emissive.setHex(0x555555);	// 発射中は発光
			currentMissile.position.x = missilePos.x;

			// 当たった処理
			if(enemy.position.x-0.5 <= parseInt(currentMissile.position.x) && enemy.position.x+0.5 >= parseInt(currentMissile.position.x) && parseInt(enemy.position.z) == parseInt(currentMissile.position.z)){
				score++;
				red++;
				// 当たったら消える
				scene.remove(enemy);
				scene.remove(currentMissile);
				currentMissile.position.z = Vertical;
				var p = Math.random();
				// 再配置
				enemy.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
				enemy.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
				scene.add(enemy);
				if(p < 0.25){
					// レア敵配置
					scene.remove(enemy);
					rare.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
					rare.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
					scene.add(rare);
				}
			}

			// 当たった処理（レア敵）
			if(rare.position.x-0.5 <= parseInt(currentMissile.position.x) && rare.position.x+0.5 >= parseInt(currentMissile.position.x) && parseInt(rare.position.z) == parseInt(currentMissile.position.z)){
				score += 3;
				yellow++;
				// 当たったら消える
				scene.remove(rare);
				scene.remove(currentMissile);
				rare.position.x = Horizon;
				currentMissile.position.z = Vertical;
				// 再配置
				enemy.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
				enemy.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
				scene.add(enemy);
			}
		});
		tween.onComplete(function(){
			Num--;
			player.material.emissive.setHex(0x000000);
			scene.remove(currentMissile);
			currentMissile = null;
			missile.shift();
		});
		tween.start();
	}
	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
	}

	if (keyboard.pressed("left")){
		if(moving　&& player.position.z < (Horizon/2-0.5)){
			move("left");
			animate();
		}
	}
	if (keyboard.pressed("right")){
		if(moving　&& player.position.z > -(Horizon/2-0.5)){
			move("right");
			animate();
		}
	}
	if (keyboard.pressed("space")){
		if(Num < MaxNum){
			fire();
			animate();
		}
	}
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(10, 9, 0, 2);	// カメラ初期化
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
		case "Z":
		changeScreen();
		break;
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	document.getElementById('rush').checked = false;
}, false);