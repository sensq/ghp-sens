//=====================
// 必要なjsファイルの読み込み
document.write('<script type="text/javascript" src="../three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three61/three.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../util/dat.gui.min.js"></script>');
document.write('<script type="text/javascript" src="../util/TeapotGeometry.js"></script>');
document.write('<script type="text/javascript" src="../three61/OBJLoader.js"></script>');
document.write('<script type="text/javascript" src="../three61/TrackballControls.js"></script>');
//=====================

// 必須のグローバル変数
var DRAW_AREA;
var FULLSCREEN = false;	// falseにするとブラウザ画面全体に描画
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

var imgFlag = false;

/*
** オブジェクトのプロパティの一覧を表示する関数
** デバッグ用
*/
function printProperties(obj, opt) {
	var properties = new String();
	// 第2引数に0を入れるとalertで表示される
	if(opt == 0){
		for (var prop in obj){
			if(obj[prop] == ''){
				obj[prop] = '無し';
			}
			properties += prop + obj[prop];
		}
		if(properties == ''){
			properties = 'Property is none.';
		}
		alert(properties);
	}else{
		for (var prop in obj){
			if(obj[prop] == ''){
				obj[prop] = '<i>無し</i>';
			}
		properties += "<font color='blue'><b>" + prop + "</b></font> =<br>" + obj[prop] + "<br><br>";
		}
		if(properties == ''){
			properties = 'Property is none.';
		}
		// 別ページに表示される
		// 場所によってはFPS表示の枠などが表示されるのは仕様
		var newWin = window.open(obj, obj, "width=400,height=600");
		newWin.document.open();
		newWin.document.write('<title>プロパティリスト</title>');
		newWin.document.write(properties);
		newWin.document.close();
	}
};

/*
** ☆描画領域の設定とレンダラーの作成
*/
function initThree(){
	// 描画領域とするブロック要素を指定
	DRAW_AREA = document.getElementById('draw_area');
	if(FULLSCREEN){
		// CSSを変更
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		DRAW_AREA.style.width = '100%';
		DRAW_AREA.style.position = 'absolute';
	};

	renderer = new THREE.WebGLRenderer({antialias: true});
	// 描画領域のサイズを取得
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	DRAW_AREA.appendChild(renderer.domElement);
	renderer.setSize(Width, Height);
	// デフォルトの背景色とα値
	renderer.setClearColorHex(0x333333, 1.0);
};

/*
** FPSの表示
*/
function viewFPS(){
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	if(FULLSCREEN){
		stats.domElement.style.top = '5px';
		stats.domElement.style.left = '5px';
	}else{
		stats.domElement.style.top = '11%';
		stats.domElement.style.left = '5.5%';
	};
	DRAW_AREA.appendChild(stats.domElement);
};

/*
** ☆カメラの設定
*/
function initCamera() {
	// 透視投影（画角, アスペクト比, 表示される手前の限界距離, 表示される奥の限界距離）
	camera = new THREE.PerspectiveCamera(90, Width / Height, 1, 10000);
	// カメラの位置
	camera.position = new THREE.Vector3(0, 45, 300);
	// カメラを動かせるようにする（2つ目の引数はマウス入力を受け付けるdiv要素）
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	// 各種オプション
	controls.noRotate = false;	// 回転禁止
	controls.noZoom = false;	// ズーム禁止
	controls.noPan = false;		// 平行移動禁止
	controls.dynamicDampingFactor = 0.3;	// 回転時の速度の減衰率
	controls.minDistance = 0;	// ズームイン最大値
	controls.maxDistance = Infinity;	// ズームアウト最大値

	// 向いている方向
	controls.target = new THREE.Vector3(0, 0, 0)
};

/*
** ☆画面初期化
*/
function initScene() {
	scene = new THREE.Scene();
};

/*
** ☆光源の設定
** 場合によって試行錯誤が必要
*/
function initLight() {
	// 平行光源
	/* メイン光源に半球ライトを使うので必要ないが、*/
	/* シャドーマッピングは平行光源しか対応してないので黒にして置いとく */
	light = new THREE.DirectionalLight(0x888888);
	light.position = new THREE.Vector3(0, 0, 0);
	scene.add(light);
	
	// 環境光（位置を指定する必要はない）
	var amb = 0x333333;
	var ambient = new THREE.AmbientLight(amb);
	scene.add(ambient);

	// 半球ライト（メインの光源）
	Hemilight = new THREE.HemisphereLight(0x666666, amb);
	Hemilight.position = new THREE.Vector3(0, 0, 0);
	scene.add(Hemilight);
};

/*
** テクスチャをセットする関数
** デフォルトの関数が長くて面倒なので作成
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

function particle(numParticles, radius){
	// 画像読み込み後は形状を変えてもその画像を使う
	if(imgFlag){
		texture = setTexture(imgURL);
	}else{
		texture = setTexture('./miku.png');
	}

	// パーティクルのマテリアルを作成
	var material = new THREE.ParticleBasicMaterial({
		size: 10,
		transparent: true,
		opacity: 0.7,
		map: texture,
		color: 0xffffff,
		blending: THREE.NormalBlending,
		depthTest: false,
	});

	// 粒子一つ一つの色を変える
	if(document.getElementById('Rcolor').checked){
		material.vertexColors = true;
	}else{
		material.vertexColors = false;
	}

	geometry = new THREE.Geometry();

	// 立方体
	if(document.getElementById('cube').checked){
		for(var i = 0 ; i < numParticles ; i++) {
			var area = new THREE.Vector3(
				Math.sqrt(2) * radius * (Math.random() - 0.5),
				Math.sqrt(2) * radius * (Math.random() - 0.5),
				Math.sqrt(2) * radius * (Math.random() - 0.5)
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 不均一な円
	}else if(document.getElementById('circle_bad').checked){
		var x, y;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.cos(ph);
			y = r * Math.sin(ph);
			var area = new THREE.Vector3(
				x, y, 0
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 均一な円
	}else if(document.getElementById('circle_good').checked){
		var x, y;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.sqrt(Math.random());
			ph = 2 * Math.PI * Math.random();

			x = r * Math.cos(ph);
			y = r * Math.sin(ph);
			var area = new THREE.Vector3(
				x, y, 0
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 球の表面に不均一に分布
	}else if(document.getElementById('surf_bad').checked){
		var x, y, z;
		var r, th, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius;
			th = 2 * Math.PI * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.sin(th) * Math.cos(ph);
			y = r * Math.sin(th) * Math.sin(ph);
			z = r * Math.cos(th);
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 球の表面に均一に分布
	}else if(document.getElementById('surf_good').checked){
		var x, y, z;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = 2 * (Math.random() - 0.5);
			ph = 2 * Math.PI * Math.random();

			x = radius * Math.sqrt(1 - Math.pow(r, 2)) * Math.cos(ph);
			y = radius * Math.sqrt(1 - Math.pow(r, 2)) * Math.sin(ph);
			z = radius * r;
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 不均一な球
	}else if(document.getElementById('sphere_bad').checked){
		var x, y, z;
		var r, th, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.random();
			th = 2 * Math.PI * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.sin(th) * Math.cos(ph);
			y = r * Math.sin(th) * Math.sin(ph);
			z = r * Math.cos(th);
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// 均一な球
	}else if(document.getElementById('sphere_good').checked){
		var x, y, z;
		var r1, r2, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r1 = 2 * (Math.random() - 0.5);
			r2 = Math.random();
			ph = 2 * Math.PI * Math.random();

			x = radius * Math.pow(r2, 1.0/3.0) * Math.sqrt(1 - Math.pow(r1, 2)) * Math.cos(ph);
			y = radius * Math.pow(r2, 1.0/3.0) * Math.sqrt(1 - Math.pow(r1, 2)) * Math.sin(ph);
			z = radius * Math.pow(r2, 1.0/3.0) * r1;
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	// リサージュ曲線
	}else if(document.getElementById('Lissajous').checked){
		var x, y, z;
		var fr1 = parseFloat(document.getElementById('fr1').value);
		var fr2 = parseFloat(document.getElementById('fr2').value);
		var fr3 = parseFloat(document.getElementById('fr3').value);
		var ph1 = parseFloat(document.getElementById('ph1').value);
		var ph2 = parseFloat(document.getElementById('ph2').value);
		var ph3 = parseFloat(document.getElementById('ph3').value);
		for(var i = 0 ; i < numParticles ; i++) {
			x = radius * Math.sin(fr1 * i + ph1);
			y = radius * Math.sin(fr2 * i + ph2);
			z = radius * Math.sin(fr3 * i + ph3);
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	// 球面リサージュ
	}else if(document.getElementById('3DLissajous').checked){
		var x, y, z;
		var u, v;
		var p = parseFloat(document.getElementById('fr_p').value);
		var q = parseFloat(document.getElementById('fr_q').value);
		var r = parseFloat(document.getElementById('fr_r').value);
		for(var i = 0 ; i < numParticles ; i++) {
			u = (q/p) * i;
			v = r * i;
			x = radius * Math.cos(u) * Math.sin(v);
			y = radius * Math.sin(u) * Math.sin(v);
			z = radius * Math.cos(v);
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	}

	// パーティクルを作成
	mesh = new THREE.ParticleSystem(geometry, material);
	mesh.position = new THREE.Vector3(0, 0, 0);
	mesh.sortParticles = false;
	scene.add(mesh);
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	particle(2000, 200);
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); // マウス操作用
	stats.update();

	// 光源
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		radius * Math.sin(omega * 0.5 * Math.PI / 180),
		80,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;
	
	// 最終的な描画
	renderer.render(scene, camera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera();	// カメラ初期化
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
** 画像を読み込む関数
*/
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			mesh.material.map = setTexture(e.target.result);
			imgURL = e.target.result;
			imgFlag = true;
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

/*
** 一括してシーンを作り直す関数
** 汎用性が高くて楽だけど若干遅い
*/
function updateScene() {
	initScene();
	initLight();
	initObject();
};

/*
** 個別にイベントを実行する関数を集めたクラス
** ボタン類でのイベントはできるだけこっちで書く
*/
var updateObject = (function (){
	// パーティクルの変化
	this.Particles = function(){
		var numParticles = document.getElementById('numParticles').value;
		var radius = document.getElementById('radius').value;
		var size = document.getElementById('size').value;
		scene.remove(mesh)
		particle(numParticles, radius);
		mesh.material.size = size;
	};
	// パーティクル全体を回転
	this.rotate = function(){
		if(document.getElementById('rotate').checked){
			(function mov(){
				rotMesh = requestAnimationFrame(mov);
				var omega = 1.0;
				mesh.rotation.y = omega * 0.5 * rotMesh * Math.PI / 360;
				mesh.rotation.z = omega * 0.5 * rotMesh * Math.PI / 180;
			})();
		}else{
			cancelAnimationFrame(rotMesh);
		}
	}
	return this;
})();

/*
** 描画領域をブラウザ全体か一部のみかに変更する関数
*/
function changeScreen(){
	// CSSを変更して位置調整
	if(FULLSCREEN == false){
		FULLSCREEN = true;
		// body全体を縮小して見えなくする
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		// statsの位置調整
		stats.domElement.style.top = '5px';
		stats.domElement.style.left = '5px';
		// 描画領域を全体に拡大
		DRAW_AREA.style.width = '100%';
		DRAW_AREA.style.position = 'absolute';
	}else{
		FULLSCREEN = false;
		document.body.style.width = '98%';
		document.body.style.height = '98%';
		stats.domElement.style.top = '11%';
		stats.domElement.style.left = '5.5%';
		DRAW_AREA.style.width = '60%';
		DRAW_AREA.style.position = 'static';
	}
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// リサイズ
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
};

//======================
// ここからはイベントに関する記述
//======================

/*
** 任意の要素のオフセットを取得する関数 （描画領域のオフセット位置取得用）
** マウス座標を正しく取得するために必要
*/
function　getElementPosition(element) {
        var top = left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
};

/*
** マウス座標を取得して衝突したオブジェクトを返す関数
*/
var getIntersects = function(mouseX, mouseY){
	// マウス座標からRayを作成
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	// Rayが衝突したオブジェクトを取得
	var intersects = ray.intersectObjects(scene.children);
	return intersects;
};

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
** ウィンドウのリサイズに対応
*/
window.addEventListener('resize', function() {
	// リサイズ時の描画領域のサイズ取得
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// リサイズ実行
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
}, false);

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	document.getElementById('numParticles').value = 2000;
	document.getElementById('radius').value = 200;
	document.getElementById('size').value = 10;
	document.getElementById('rotate').checked = true;
	
	// リサージュ曲線パラメータ
	document.getElementById('fr1').value = 5;
	document.getElementById('fr2').value = 6;
	document.getElementById('fr3').value = 0;
	document.getElementById('ph1').value = Math.PI/2;
	document.getElementById('ph2').value = Math.PI/2;
	document.getElementById('ph3').value = 0;

	// 球面リサージュ曲線パラメータ
	document.getElementById('fr_p').value = 4;
	document.getElementById('fr_q').value = 5;
	document.getElementById('fr_r').value = 1;
	updateObject.rotate();
}, false);