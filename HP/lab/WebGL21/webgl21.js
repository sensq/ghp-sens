document.write('<script type="text/javascript" src="./myTemplate.js"></script>');

// グローバル変数
var collision = false;

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	sky = new myObj.skyboxSphere();
	scene.add(sky);
	floor = new myObj.segmentPlane(50, 50);
	scene.add(floor.mesh);
	floor.mesh.rotation.x = Math.PI/180*90;
	floor.mesh.position.y = -1.01;

	loadBlender("move.js");
	anim = BlenderAnimationPrepare(0, 80, 2000)
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//マウス操作用

	if(collision){
		anim.move = true;
	}else{
		controls.target = meshBlender.position;
		anim.move = false;
		if (keyboard.pressed("up")){
			meshBlender.translateZ(-0.2);
			anim.move = true;
		}
		if (keyboard.pressed("down")){
			meshBlender.translateZ(0.2);
			anim.move = true;
		}
		if (keyboard.pressed("left")){
			meshBlender.rotation.y += Math.PI/180*5;
			anim.move = true;
		}
		if (keyboard.pressed("right")){
			meshBlender.rotation.y -= Math.PI/180*5;
			anim.move = true;
		}
	}

	// Blenderアニメーション
	if (meshBlender && anim.move){
		BlenderAnimation(anim)
	}

	// 光源
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		30+radius * Math.sin(omega * 0.5 * Math.PI / 180),
		10,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;

	renderer.render(scene, camera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(18, 7, 9);	// カメラ初期化
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
updateObject.move = function(){
	scene.remove(meshBlender)
	loadBlender("move.js");
	collision = false;
	anim = BlenderAnimationPrepare(0, 80, 2000)
}
updateObject.collision = function(){
	initCamera(18, 7, 9)
	scene.remove(meshBlender)
	loadBlender("collision.js", 1, 0, -0.2);
	// meshBlender.position.y = 30;
	collision = true;
	anim = BlenderAnimationPrepare(0, 200, 6000)
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

	if(ctrl){	// ctrl押しながらの場合
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;
		};
	}else if(shift){	// shift押しながらの場合
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;
		};
	}else{
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;

			case "Z":
			changeScreen();
			break;
		};
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
}, false);