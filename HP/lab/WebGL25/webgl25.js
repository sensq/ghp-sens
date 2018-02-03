document.write('<script type="text/javascript" src="./myTemplate.js" charset="utf-8"></script>');
document.write('<script type="text/javascript" src="./SphericalHarmonics.js" charset="utf-8"></script>');

var r = 15;
var l = 3;
var m = 1;
var slice = 70;
var stack = 70;

function showValue() {
	// 値を表示
	document.getElementById("para_r").value = document.getElementById("range0").value;
	document.getElementById("para_l").value = document.getElementById("range1").value;
	document.getElementById("para_m").value = document.getElementById("range2").value;
	document.getElementById("slice").value = document.getElementById("range3").value;
	document.getElementById("stack").value = document.getElementById("range4").value;
}

function setParameter() {
	// 値を代入
	r = Number(document.getElementById("range0").value);
	l = Number(document.getElementById("range1").value);
	m = Number(document.getElementById("range2").value);
	slice = Number(document.getElementById("range3").value);
	stack = Number(document.getElementById("range4").value);
	// lに合わせてmの範囲を変更
	document.getElementById("range2").min = -l;
	document.getElementById("range2").max = l;

	// エラー処理
	if (m > l) {
		m = l;
		document.getElementById("range2").value = l;
	}
	else if (m < -l) {
		m = -l;
		document.getElementById("range2").value = -l;
	}

	// 値を表示
	showValue();

	// 再描画
	set();
}

function set() {
	delete stats;
	viewFPS();
	initScene();
	initLight();
	initObject();
	renderer.clear();
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	renderer.setClearColorHex(0x000000, 1.0);

	var mode = document.getElementById('mode').checked;
	var wire = document.getElementById('wire').checked;
	var color = [];
	color[0] = document.getElementById('range_r').value;
	color[1] = document.getElementById('range_g').value;
	color[2] = document.getElementById('range_b').value;
	var mesh = drawBasisSH(r, l, m, slice, stack, 1, 1, wire, mode, color);
	scene.add(mesh);

	// 光源
	light.color.setHex(0x505050);
	ambient.color.setHex(0x202020);
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//マウス操作用

	renderer.render(scene, camera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(10, 9, 0);	// カメラ初期化
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
var updateObject = function () { };

//===========================
// ここからはその他のイベントに関する記述
//===========================

/*
** マウス移動時のイベント
*/
document.addEventListener('mousemove', function (e) {
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
document.addEventListener('click', function (e) {
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
document.onkeydown = function (e) {
	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if (keycode >= 48 & keycode <= 90) {
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};
	switch (keycode) {
		case "Z":
			changeScreen();
			break;
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function () {
	document.getElementById("mode").checked = false;
	document.getElementById("wire").checked = false;

	document.getElementById("para_r").value = 15;
	document.getElementById("para_l").value = 3;
	document.getElementById("para_m").value = 1;
	document.getElementById("slice").value = 70;
	document.getElementById("stack").value = 70;
	document.getElementById("range0").value = 15;
	document.getElementById("range1").value = 3;
	document.getElementById("range2").value = 1;
	document.getElementById("range3").value = 70;
	document.getElementById("range4").value = 70;

	document.getElementById("range2").min = -document.getElementById("range1").value;
	document.getElementById("range2").max = document.getElementById("range1").value;
}, false);
