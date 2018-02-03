//=====================
// 必要なjsファイルの読み込み
document.write('<script type="text/javascript" src="../three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three61/three.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../three61/TrackballControls.js"></script>');
//=====================

// 必須のグローバル変数
var DRAW_AREA;
var FULLSCREEN = false;	// falseにするとブラウザ画面全体に描画
var SHADOW = false;	// シャドーマッピングのON/OFF
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

var vFlag = false;
var videoURL;

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
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	if(SHADOW == true){
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
	}else{
		renderer.shadowMapEnabled = false;
		renderer.shadowMapSoft = false;
	};
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
	camera.position = new THREE.Vector3(100, 200, 100);
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
	
	// シャドーマッピングを行う場合
	if(SHADOW == true){
		light.target.position.copy(scene.position);
		// 光源を可視化（主に確認用）
		if(document.getElementsByName('light_vis')[0].checked)
			light.shadowCameraVisible = true;
		light.castShadow = true;
		// 光線の範囲
		light.shadowCameraLeft = -120;
		light.shadowCameraRight = 120;
		light.shadowCameraTop = -120;
		light.shadowCameraBottom = 120;
		light.shadowCameraNear = -200;
		light.shadowCameraFar = 600;
		light.shadowBias = -.001;
		// 影の解像度
		resolution = 2048;
		light.shadowMapWidth = light.shadowMapHeight = resolution;
		// 影の濃さ
		light.shadowDarkness = .7;
	};
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
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	canvas = document.createElement('canvas');
	videoContext = canvas.getContext('2d');
	video = document.createElement('video');
	if(!vFlag){
		video.src = "../../lab2/movie/GN.mp4";
	}else{
		video.src = videoURL;
	}
	video.load();
	video.play();

	var playback = document.getElementById("playback");
	var time = document.getElementById("time");

	// ビデオのメタデータを読み込んだら、スライダーを利用可能にする
	video.addEventListener("loadedmetadata", function() {
		playback.disabled = false;
		playback.min = playback.value = video.initialTime || 0;
		playback.max = video.duration;
	}, false);

	// 再生時間が変化するたび、スライダーの位置を更新
	video.addEventListener("timeupdate", function() {
		playback.value = video.currentTime;
		time.innerHTML = (video.currentTime).toFixed(0) + " / " + (video.duration).toFixed(0) + "[秒]";
	}, false);
	// スライダーの値が変化したら、動画の再生位置を変更
	playback.addEventListener("change", function() {
		video.currentTime = this.valueAsNumber;
	}, false);

	video.addEventListener('loadeddata', function() {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		videoContext.fillStyle = '#000000';
		videoContext.fillRect( 0, 0, canvas.width, canvas.height );

		videoTexture = new THREE.Texture(canvas);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;

		// テクスチャを貼る平面を作成する関数
		(function () {
			if(!document.getElementById("sphere").checked){
				var geo = new THREE.PlaneGeometry(canvas.width, canvas.height);
			}else{
				var geo = new THREE.SphereGeometry(canvas.width, 33,33);
			}
			var mat = new THREE.MeshPhongMaterial({
				color: 0xaaaaff,
				ambient: 0x888888,
				specular: 0x888888,
				shininess: 90,
				metal: true,
				side: 2,
				map: videoTexture,
				overdraw: true
			});
			mesh = new THREE.Mesh(geo, mat);
			mesh.rotation.x = -(Math.PI/2.0);
			mesh.rotation.z = (Math.PI/2.0);
			mesh.position = new THREE.Vector3(25, 0, 25);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add(mesh);
		})();
	}, false);

	var skyboxSphere = (function () {
		var geoSky = new THREE.SphereGeometry(5000, 30, 30);
		var matSky = new THREE.MeshPhongMaterial({
			color: 0x00aaff,
			ambient: 0xaaaaff,
			specular: 0x000000,
			shininess: 90,
			metal: true,
			side: 2
		});
		meshSkySphere = new THREE.Mesh(geoSky, matSky);
		meshSkySphere.receiveShadow = true;
	})();
	scene.add(meshSkySphere);
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); // マウス操作用
	stats.update();

	// 回転用変数
	var omega;	// 角速度[deg/frm]
	var radius;	// 半径

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}

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
** ローカルから動画を読み込む関数
** クロスドメイン制約で上手くいかないらしい
*/
function loadVideo(){
	if (document.getElementById('loadVideo').files[0].type.match('video.*')) {
		var video = document.getElementById('loadVideo').files[0];
		var info = "name:" + video.name + " size:" + video.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		fr.onload = onFileLoad;
		fr.readAsDataURL(video);
	}else{
		alert("動画ファイルを指定して下さい");
	}
}

function onFileLoad(e) {
	videoURL = e.target.result;
	vFlag = true;
	initScene();
	initLight();
	initObject();
}

/*
** 一括してシーンを作り直す関数
** 汎用性が高くて楽だけど若干遅い
*/
function updateScene() {
	video_control.stop();
	initScene();
	initLight();
	initObject();
};

/*
** 個別にイベントを実行する関数を集めたクラス
** ボタン類でのイベントはできるだけこっちで書く
*/
var updateObject = (function (){
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
	// dat.guiを作り直す（作り直さないと動作しなくなる）
	dat_gui();
};

//======================
// ここからはイベントに関する記述
//======================

/*
** 動画制御
*/
var video_control = (function (){
	// 再生/一時停止
	this.pause = function(){
		var button = document.getElementById("pause");
		if(video.paused){
			video.play();
			button.textContent = "一時停止";
		}else{
			video.pause();
			button.textContent = "　再生　";
		}
	}
	// 停止
	this.stop = function(){
		video.pause();
		video.currentTime = 0;
		var button = document.getElementById("pause");
		if(!video.paused){
			button.textContent = "一時停止";
		}else{
			button.textContent = "　再生　";
		}
	}
	// ミュート
	this.mute = function(){
		if(video.muted){
			video.muted = false;
		}else{
			video.muted = true;
		}
	}
	// 再生速度変更
	this.rate = function(){
		var rate = document.getElementById("playRate").value;
		if(rate > 4.0){
			rate = 4.0;
		}else if(rate < 0.5){
			rate = 0.5;
		}
		video.playbackRate = rate;
	}
	// 早送り/巻戻し
	this.skip = function (value) {
		onMouse = true;
		(function mov(){
			if(onMouse){
				requestAnimationFrame(mov);
			}
			video.currentTime += value;
		})();
	}
	return this;
})();

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

	// mesh上で発光
	if(intersects[0].object == mesh){
		mesh.material.emissive.setHex(0x888888);
	}else{
		mesh.material.emissive.setHex(0);
	};
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
			// カメラ回転停止
			cancelAnimationFrame(moveCamera);
			break;	

			case 38:	// up
			mesh.position.y += 1;
			break;

			case 39:	// right
			// カメラ回転
			(function mov(){
			moveCamera = requestAnimationFrame(mov);
			var omega = 0.5;
			var radius = 80;
			camera.position = new THREE.Vector3(
				radius * Math.sin(omega * 0.5 * moveCamera * Math.PI/180),
				50,
				radius * Math.cos(omega * 0.5 * moveCamera * Math.PI/180)
				);
			})();
			break;

			case 40:	// down
			mesh.position.y -= 1;
			break;
		};
	}else{
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			video_control.pause();
			break;

			case 39:	// right
			break;

			case 40:	// down
			video_control.stop();
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
	document.getElementById("sphere").checked = false;
	document.getElementById("playRate").value = (1.0).toFixed(1);
}, false);