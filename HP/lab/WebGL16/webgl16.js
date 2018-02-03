//=====================
// 必要なjsファイルの読み込み
document.write('<script type="text/javascript" src="../three58/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three58/three.js"></script>');
document.write('<script type="text/javascript" src="../three58/OBJLoader.js"></script>');
document.write('<script type="text/javascript" src="../three58/TrackballControls.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../util/dat.gui.min.js"></script>');
document.write('<script type="text/javascript" src="../util/TeapotGeometry.js"></script>');
//=====================

// 必須のグローバル変数
var DRAW_AREA;
var FULLSCREEN = false;	// falseにするとブラウザ画面全体に描画
var SHADOW = false;	// シャドーマッピングのON/OFF
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

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
	camera.position = new THREE.Vector3(0, 45, 25);
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
** 文字テクスチャを作成して返す関数
*/
function setCtxTexture(str, color, size, fonttype, bgsize, transparent){
	// 引数省略した場合のデフォルト値
	if(str === undefined | str === null){
		// 文字列
		var str = 'Test';
	};
	if(color === undefined | color === null){
		// 色
		var color = 0x000000;
	};
	if(size === undefined | size === null){
		// 文字サイズ
		var size = 65;
	};
	if(fonttype === undefined | fonttype === null){
		// フォント
		var fonttype = 'ＭＳ Ｐゴシック';
	};
	if(bgsize === undefined | bgsize === null){
		// 背景のサイズ
		var bgsize = 600;
	};
	if(transparent === undefined | transparent === null){
		// 背景透過
		var transparent = false;
	};

	// 他と同様の16進数の形で色を指定できるようにするための処理
	var rgb = new String();
	color = color.toString(16);
	color = ('0000' + color).slice(-6);
	rgb = '#' + color;

	// canvas要素を取得
	var font = new String();
	var canvas = document.createElement('canvas');
	// 画像の解像度に相当
	canvas.width = 256; canvas.height = 256;
	var ctx = canvas.getContext('2d');
	// 背景色を擬似的に作成（サイズと位置は適当に調整する）
	if(!transparent){
		ctx.fillStyle = 'white';
		ctx.font = bgsize + 'px' + ' ' + 'ＭＳ Ｐゴシック';;
		ctx.textAlign = 'center';
		ctx.fillText('■', canvas.width/2, canvas.height + bgsize/4);
	};
	// 文字作成
	ctx.fillStyle = rgb;
	ctx.font = size + 'px' + ' ' + fonttype;;
	ctx.textAlign = 'center';
	ctx.fillText(str, canvas.width/2, canvas.height/2 + size/3);
	// テクスチャを作成
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};

/*
** テクスチャをセットする関数
** デフォルトの関数が長くて面倒なので作成
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

// ブレンダー読み込み
function loadBlender(filename, scale, x, y, z, rx, ry, rz){
	// 引数指定しない場合のデフォルト値
	if(scale === undefined | scale === null){var scale = 1;}
	if(x === undefined | x === null){var x = 0;}
	if(y === undefined | y === null){var y = 0;}
	if(z === undefined | z === null){var z = 0;}
	if(rx === undefined | rx === null){var rx = 0;}
	if(ry === undefined | ry === null){var ry = 0;}
	if(rz === undefined | rz === null){var rz = 0;}

	var loader = new THREE.JSONLoader();
	var geometry;
	var materials = [];
	loader.load(filename, callback);
	function callback(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		meshBlender = new THREE.SkinnedMesh(geometry, material);
		meshBlender.scale = new THREE.Vector3(scale, scale, scale);
		meshBlender.position = new THREE.Vector3(x, y, z);
		meshBlender.rotation.x = rx * Math.PI/180;
		meshBlender.rotation.y = ry * Math.PI/180;
		meshBlender.rotation.z = rz * Math.PI/180;
		meshBlender.castShadow = true;
		meshBlender.receiveShadow = true;
		for(i=0; i<materials.length; i++){
			// ambientが全部0になるらしいのでカラーの値を入れる
			materials[i].ambient = materials[i].color;
			materials[i].side = 2;
			// アニメーションを行えるようにする（上手くいってないので保留）
			// materials[i].morphTargets = true;
		};
		// どのフレームを表示するかを指定
		// meshBlender.morphTargetInfluences[0] = 1;
		scene.add(meshBlender);
	};
};

// obj読み込み
function loadSoccer(scale, x, y, z, rx, ry, rz){
	// 引数指定しない場合のデフォルト値
	if(scale === undefined | scale === null){var scale = 1;}
	if(x === undefined | x === null){var x = 0;}
	if(y === undefined | y === null){var y = 0;}
	if(z === undefined | z === null){var z = 0;}
	if(rx === undefined | rx === null){var rx = 0;}
	if(ry === undefined | ry === null){var ry = 0;}
	if(rz === undefined | rz === null){var rz = 0;}

	var loader = new THREE.OBJLoader();
	var geometry;
	loader.load('./s06.obj', function(geometry) {
		meshSoccer = geometry;
		//サッカーボール
		var c = meshSoccer.children[0].geometry.faces;
		for(i=0; i<c.length; i++){
			if(i<40){
				c[i].materialIndex = 0;	//六角形
			}else{
				c[i].materialIndex = 1;	//五角形
			}
		}
		meshSoccer.children[0].material = new THREE.MeshFaceMaterial([
			new THREE.MeshLambertMaterial({ color:0xdddddd, side:2 }),
			new THREE.MeshLambertMaterial({ color:0x000000, side:2 })
		]);
        meshSoccer.scale = new THREE.Vector3(scale, scale, scale);
		meshSoccer.position = new THREE.Vector3(x, y, z);
		meshSoccer.rotation.x = rx * Math.PI/180;
		meshSoccer.rotation.y = ry * Math.PI/180;
		meshSoccer.rotation.z = rz * Math.PI/180;
		// 入れてるけどなぜか影が出ない
		meshSoccer.castShadow = true;
		meshSoccer.receiveShadow = true;
		scene.add(meshSoccer);
	});
};

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	var texture = [];
	texture[0] = setCtxTexture('Home', 0x00ffff);
	texture[1] = setCtxTexture('Twitter', 0xff00ff);
	texture[2] = setCtxTexture('Blog', 0xffff00);
	texture[3] = setCtxTexture('Works', 0x0000ff);
	texture[4] = setCtxTexture('Google', 0x00ff00);
	texture[5] = setCtxTexture('pixiv', 0xff0000);

	// キューブの各面の色を設定
	var materials = [
		new THREE.MeshPhongMaterial({color:0xff0000}),
		new THREE.MeshPhongMaterial({color:0x00ff00}),
		new THREE.MeshPhongMaterial({color:0x0000ff}),
		new THREE.MeshPhongMaterial({color:0xffff00}),
		new THREE.MeshPhongMaterial({color:0xff00ff}),
		new THREE.MeshPhongMaterial({color:0x00ffff})
	];
	// 色以外のパラメータを一括して設定
	for(var i=0; i<6; i++){
		materials[i].side = 2;
		materials[i].map = texture[i];
		if(document.getElementsByName('Blending')[0].checked){
			materials[i].blending = THREE.NormalBlending;
			materials[i].transparent = true;
			materials[i].opacity = 0.8;
		};
	};
	var material = new THREE.MeshFaceMaterial(materials);
	var geometry = new THREE.CubeGeometry(15, 15, 15);
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position = new THREE.Vector3(0, 0, 0);
	scene.add(mesh);

	// 環境マッピング用画像（全部同じ大きさでないとダメ）
	var imgs = [];
	imgs[0] = 'skybox/px.jpg';
	imgs[1] = 'skybox/nx.jpg';
	imgs[2] = 'skybox/py.jpg';
	imgs[3] = 'skybox/ny.jpg';
	imgs[4] = 'skybox/pz.jpg';
	imgs[5] = 'skybox/nz.jpg';

	// スフィア作成
	var geoEnv = new THREE.SphereGeometry(10, 32, 32);
	var matEnv = new THREE.MeshPhongMaterial({
		emissive: 0x000000, color:0xaaaaaa, specular:0, ambient: 0x333333,
		side: 2,
	});
	// テクスチャ
	if(document.getElementsByName('onTexture')[0].checked){
		matEnv.map = setTexture('miku.jpg');
	};
	// 環境マッピング
	if(document.getElementsByName('onEnv')[0].checked){
		matEnv.envMap = THREE.ImageUtils.loadTextureCube(imgs, new THREE.CubeRefractionMapping());
		matEnv.reflectivity = 1.0;
		matEnv.refractionRatio = 0.6;
	};
	// バンプマッピング
	if(document.getElementsByName('onBump')[0].checked){
		matEnv.bumpMap = setTexture('miku.jpg');
		matEnv.bumpScale = 0.1;
	};
	meshEnv = new THREE.Mesh(geoEnv, matEnv);
	meshEnv.castShadow = true;
	meshEnv.position = new THREE.Vector3(0, 25, 0);
	scene.add(meshEnv);

	// Teapot
	var geoTea = new THREE.TeapotGeometry(6, 20, 1, 0, 1, 1, 1);
	var matTea = new THREE.MeshPhongMaterial({
		emissive: 0x777777, color:0x333333, specular:0xee9900, ambient: 0x000000,
		shininess: 4,
		metal: true,
		side: 2,
	});
	matTea.map = setTexture('./backgrounddetailed6.jpg');
	matTea.envMap = THREE.ImageUtils.loadTextureCube(imgs, new THREE.CubeRefractionMapping());
	var meshTea = new THREE.Mesh(geoTea, matTea);
	meshTea.castShadow = true;
	meshTea.receiveShadow = true;
	meshTea.position = new THREE.Vector3(25, -3.5, -8);
	meshTea.rotation.y = Math.PI/4;
	scene.add(meshTea);

	// ブレンダー読み込み＆表示
	loadBlender('zatsu.js', 3, -32, -2.5, -10);
	loadBlender('zatsu.js', 3, -38, -2.5, -5, 0, 90, 0);
	
	// obj読み込み＆表示
	loadSoccer(5, -20, -5, 30);

	// スカイボックスを作成する関数
	// キューブだとテクスチャに使う画像の準備が面倒
	var skyboxSphere = (function () {
		var geoSky = new THREE.SphereGeometry(400, 18, 18);
		var matSky = new THREE.MeshPhongMaterial({
			color: 0x00aaff,
			ambient: 0xaaaaff,
			specular: 0x000000,
			shininess: 90,
			metal: true,
			side: 2
		});
		if(document.getElementsByName('onSky')[0].checked){
			matSky.map = setTexture('sphere.jpg');
			matSky.color.setHex(0xffffff);
			matSky.ambient.setHex(0xffffff);
			// 環境マッピングで代用できるが若干重い
			// matSky.envMap = THREE.ImageUtils.loadTextureCube(imgs);
			// matSky.refractionRatio = 0;
		};
		meshSkySphere = new THREE.Mesh(geoSky, matSky);
		meshSkySphere.receiveShadow = true;
	})();
	// キューブだと六面用意すればいいので比較的楽
	var skyboxCube = (function () {
		if(document.getElementsByName('onSky')[0].checked){
			var imgs = [];
			imgs[0] = setTexture('skybox/px.jpg');
			imgs[1] = setTexture('skybox/nx.jpg');
			imgs[2] = setTexture('skybox/py.jpg');
			imgs[3] = setTexture('skybox/ny.jpg');
			imgs[4] = setTexture('skybox/pz.jpg');
			imgs[5] = setTexture('skybox/nz.jpg');
			var matsSky = [];
			for(var i=0; i<6; i++){
				matsSky[i] = new THREE.MeshPhongMaterial();
				matsSky[i].side = 2;
				matsSky[i].map = imgs[i];
			};
			var matSky = new THREE.MeshFaceMaterial(matsSky);
		}else{
			var matSky = new THREE.MeshPhongMaterial({
				color: 0x00aaff,
				ambient: 0xaaaaff,
				side: 2
			});
		};
		var geoSky = new THREE.CubeGeometry(600, 600, 600);
		meshSkyCube = new THREE.Mesh(geoSky, matSky);
		meshSkyCube.receiveShadow = true;
	})();
	if(document.getElementsByName('onSkyform')[0].checked){
		scene.add(meshSkyCube);
	}else{
		scene.add(meshSkySphere);
	};

	// 床を作成する関数
	(function floor() {
		// 格子模様は画像を使って簡略化
		var textureFloor = setTexture('./gray.jpg');
		var geoFloor = new THREE.PlaneGeometry(100, 100);
		var matFloor = new THREE.MeshPhongMaterial({
			color: 0xaaaaff,
			ambient: 0x888888,
			specular: 0x888888,
			shininess: 90,
			metal: true,
			side: 2,
			map: textureFloor
		});
		meshFloor = new THREE.Mesh(geoFloor, matFloor);
		meshFloor.rotation.x = -(Math.PI/2.0);
		meshFloor.position = new THREE.Vector3(0, -10, 0);
		meshFloor.castShadow = true;
		meshFloor.receiveShadow = true;
		scene.add(meshFloor);
	})();
	if(document.getElementsByName('removeFloor')[0].checked){
		scene.remove(meshFloor);
	};
 	dat_gui();
};

/*
** dat.guiの作成
*/
function dat_gui(){
	var gui = new dat.GUI();
	var f1 = gui.addFolder('各種パラメータ');
	f1.add(meshEnv.material, 'reflectivity' , -5.0, 5.0).step(0.05).name("反射・屈折の強さ");
	f1.add(meshEnv.material, 'refractionRatio' , -5.0, 5.0).step(0.05).name("屈折率");
	f1.add(meshEnv.material, 'bumpScale' , -1.0, 1.0).step(0.05).name("バンプスケール");
	f1.open();

	// 重複しないようにするための処理
	// 値はhtmlの構成によって書き換える
	if(FULLSCREEN){
		// dat.guiが既に存在していたら削除（フルスクリーン化時）
		var element = document.body;
	 	if(element.childNodes.length == 17){
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiを消去
		var element = document.getElementById('dat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// フルスクリーン時のdat.guiの位置調整
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.right = '0px';
		gui.domElement.style.top = '5px';
		gui.domElement.style.height = '140px';
		document.body.appendChild(gui.domElement);
	}else{
		// dat.guiが既に存在していたら削除（ボタンクリック時）
		var element = document.getElementById('dat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// 最大化時のdat.guiを消去
		var element = document.body;
	 	if(element.childNodes.length == 17){
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiの位置調整
		gui.domElement.style.position = 'relative';
		gui.domElement.style.height = '140px';
		document.getElementById('dat').appendChild(gui.domElement);
	};
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

	// 光源回転
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		radius * Math.sin(omega * 0.5 * dt * Math.PI / 180),
		80,
		radius * Math.cos(omega * 0.5 * dt * Math.PI / 180)
		);
	light.position = Hemilight.position;

	// mesh回転
	omega = 2;
	mesh.rotation.x = omega * 0.5 * dt * Math.PI / 360;
	mesh.rotation.z = omega * 0.5 * dt * Math.PI / 180;
	
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
** 一括してシーンを作り直す関数
** 汎用性が高くて楽だけど若干遅い
*/
function updateScene() {
	if(document.getElementsByName('onShadow')[0].checked){
		SHADOW = true;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
	}else{
		SHADOW = false
		renderer.shadowMapEnabled = false;
		renderer.shadowMapSoft = false;
	};
	initScene();
	initLight();
	initObject();
};

/*
** 個別にイベントを実行する関数を集めたクラス
** ボタン類でのイベントはできるだけこっちで書く
*/
var updateObject = (function (){
	// 光可視化
	this.visibleLight = function(){
		if(document.getElementsByName('light_vis')[0].checked){
			light.shadowCameraVisible = true;
		}else{
			light.shadowCameraVisible = false;
		};
	};
	// キューブ透過
	this.blend = function(){
		if(document.getElementsByName('Blending')[0].checked){
			for(var i=0; i<6; i++){
				mesh.material.materials[i].blending = THREE.NormalBlending;
				mesh.material.materials[i].transparent = true;
				mesh.material.materials[i].opacity = 0.8;
			};
		}else{
			for(var i=0; i<6; i++){
				mesh.material.materials[i].transparent = false;
			};
		};
	};
	// キューブ消去
	this.removefloor = function(){
		if(document.getElementsByName('removeFloor')[0].checked){
			scene.remove(meshFloor);
		}else{
			scene.add(meshFloor);
		};
	};
	// テクスチャ
	this.map = function (){
		if(document.getElementsByName('onTexture')[0].checked){
			meshEnv.material.map = setTexture('miku.jpg');
		}else{
			// 文字の無い文字テクスチャ = 白一色のテクスチャを設定
			// nullだとなぜか別のテクスチャが設定されるので代替
			meshEnv.material.map = setCtxTexture('');
		};
	};
	// 環境マッピング
	this.env = function (){
		// 上手くいかなかったので妥協
		updateScene();
	};
	// バンプマッピング
	this.bump = function (){
		if(document.getElementsByName('onBump')[0].checked){
			meshEnv.material.bumpMap = setTexture('miku.jpg');
		}else{
			meshEnv.material.bumpMap = setCtxTexture('');
		};
	};
	// スカイボックス形状
	this.skyform = function(){
		if(document.getElementsByName('onSkyform')[0].checked){
			scene.remove(meshSkySphere);
			scene.add(meshSkyCube);
		}else{
			scene.remove(meshSkyCube);
			scene.add(meshSkySphere);
		};
	};
	// スカイボックステクスチャ
	this.sky = function (){
		if(document.getElementsByName('onSky')[0].checked){
			if(document.getElementsByName('onSkyform')[0].checked){
				var imgs = [];
				imgs[0] = setTexture('skybox/px.jpg');
				imgs[1] = setTexture('skybox/nx.jpg');
				imgs[2] = setTexture('skybox/py.jpg');
				imgs[3] = setTexture('skybox/ny.jpg');
				imgs[4] = setTexture('skybox/pz.jpg');
				imgs[5] = setTexture('skybox/nz.jpg');
				var matsSky = [];
				for(var i=0; i<6; i++){
					matsSky[i] = new THREE.MeshPhongMaterial();
					matsSky[i].side = 2;
					matsSky[i].map = imgs[i];
				};
				meshSkyCube.material = new THREE.MeshFaceMaterial(matsSky);
			}else{
				meshSkySphere.material = new THREE.MeshPhongMaterial({
					map: setTexture('sphere.jpg'),
					side: 2
				});
			};
		}else{
			if(document.getElementsByName('onSkyform')[0].checked){
				meshSkyCube.material = new THREE.MeshPhongMaterial({
					color: 0x00aaff,
					ambient: 0xaaaaff,
					side: 2
				});
			}else{
				meshSkySphere.material = new THREE.MeshPhongMaterial({
					map: setCtxTexture(''),
					color: 0x00aaff,
					ambient: 0xaaaaff,
					side: 2
				});
			};
		};
	};
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

	meshSoccer.rotation.x = mouseX * Math.PI/180;
	meshSoccer.rotation.y = (mouseY + mouseX) / 2 * Math.PI/180;
	meshSoccer.rotation.z = mouseY * Math.PI/180;
	// mesh上で発光
	for(var i=0; i<6; i++){
		if((intersects[0].faceIndex == i) && (intersects[0].object == mesh)){
			mesh.material.materials[i].emissive.setHex(0x666666);
		}else{
			mesh.material.materials[i].emissive.setHex(0);
		};
	};
	// mesh上でカーソルが変わる
	if(intersects[0].object == mesh){
		DRAW_AREA.style.cursor = 'pointer';
	}else{
		DRAW_AREA.style.cursor = 'default';
	};
	// meshEnv上で色変更
	if(intersects[0].object == meshEnv){
		meshEnv.material.emissive.setHex(0x00ffff);
	}else{
		meshEnv.material.emissive.setHex(0);
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

	var url = ['http://www47.atpages.jp/sensq/home/', 
		'https://twitter.com/s_sensq', 
		'http://www47.atpages.jp/sensq/blog/', 
		'http://www47.atpages.jp/sensq/lab/top2.html', 
		'https://www.google.co.jp/', 
		'http://www.pixiv.net/',
	];

	for(var i=0; i<6; i++){
		if((intersects[0].faceIndex == i) && (intersects[0].object == mesh)){
			window.open(url[i], '_top');
		};
	};
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
			meshBlender.rotation.y = -Math.PI/2;
			meshBlender.position.x -= 1;
			break;	

			case 38:	// up
			meshBlender.rotation.y = Math.PI;
			meshBlender.position.z -= 1;
			break;

			case 39:	// right
			meshBlender.rotation.y = Math.PI/2;
			meshBlender.position.x += 1;
			break;

			case 40:	// down
			meshBlender.rotation.y = 0;
			meshBlender.position.z += 1;
			break;

			case "Z":
			changeScreen();
			break;

			case "P":
			// パーティクルを追加
			var particle = (function(){
				var geoPar = new THREE.Geometry();
				var numParticles = 100;
				for(var i = 0 ; i < numParticles ; i++) {
				  geoPar.vertices.push(new THREE.Vector3(
				    Math.random() * 500 - 250,
				    Math.random() * 500 - 250,
				    Math.random() * 500 - 250));
				};
				// マテリアルを作成
				var matPar = new THREE.ParticleBasicMaterial({
					size: 7,
					transparent: true,
					opacity: 0.7,
					map: setCtxTexture('★', 0xcccc00, 280, null, null, 1),
					blending: THREE.NormalBlending,
				});
				// パーティクルを作成
				meshPar = new THREE.ParticleSystem(geoPar, matPar);
				meshPar.position = new THREE.Vector3(0, 0, 0);
				meshPar.sortParticles = false;
				scene.add(meshPar);
			})();
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
	document.getElementsByName('light_vis')[0].checked = true;
	document.getElementsByName('onTexture')[0].checked = true;
	document.getElementsByName('onBump')[0].checked = true;
	if(SHADOW == true)
		document.getElementsByName('onShadow')[0].checked = true;
	else
		document.getElementsByName('onShadow')[0].checked = false;
	document.getElementsByName('onEnv')[0].checked = true;
	document.getElementsByName('onSkyform')[0].checked = true;
	document.getElementsByName('onSky')[0].checked = true;
	document.getElementsByName('Blending')[0].checked = true;
	document.getElementsByName('removeFloor')[0].checked = false;
}, false);