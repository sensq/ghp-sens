var baseTime = +new Date();

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
	camera.position = new THREE.Vector3(20, 75, 110);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

/*
** 画面初期化
*/
function initScene() {
	scene = new THREE.Scene();
	if(document.getElementsByName('fog')[0].checked){
		if(document.getElementsByName('type')[0].checked)
			scene.fog = new THREE.FogExp2( 0xaa9966, 0.008 );
		else if(document.getElementsByName('type')[1].checked)
			scene.fog = new THREE.FogExp2( 0xaaaacc, 0.004 );
		else if(document.getElementsByName('type')[2].checked)
			scene.fog = new THREE.FogExp2( 0xaaaacc, 0.006 );
	}
}

/*
** 光源の設定
*/
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	Hemilight = new THREE.HemisphereLight(0x555555, 0x222222);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	ambient = new THREE.AmbientLight(0x777777);
	scene.add(ambient);
}

/*
** オブジェクトの設定
*/
function initObject() {
	var geometry = new THREE.PlaneGeometry(150, 150, 64, 64);
	var texture_yama = new THREE.ImageUtils.loadTexture('mountain.jpg');
	var texture_umi = new THREE.ImageUtils.loadTexture('sea.jpg');
	if(document.getElementsByName('type')[0].checked)
		var material = new THREE.MeshLambertMaterial({map: texture_yama, side: 2});
	if(document.getElementsByName('type')[1].checked)
		var material = new THREE.MeshLambertMaterial({color: 0xbbbbbb, side: 2});
	if(document.getElementsByName('type')[2].checked)
		var material = new THREE.MeshLambertMaterial({map: texture_umi, side: 2});
	var ground = new THREE.Mesh(geometry, material);
	
	ground.rotation.x = -(Math.PI/2.0).toFixed(6);
	
	// カスタムから値を代入
	target = document.getElementById("cus_h");
	cus_h = Number(target.value);
	target = document.getElementById("cus_cyc");
	cus_cyc = Number(target.value);
	// ノイズを作成
	simplexNoise = new SimplexNoise;
	// 平らな領域の割合を指定
	for ( i = Math.floor(geometry.vertices.length*0.1); i < Math.floor(geometry.vertices.length*0.9); i++ ) {
    	vertex = geometry.vertices[ i ];
		size1 = setSize(1, 10.0, 64.0);
		size2 = setSize(2, 8.0, 32.0);
		size3 = setSize(3, 6.0, 16.0);
		size4 = setSize(4, 4.0, 8.0);
		size5 = setSize(5, 2.0, 4.0);
		size6 = setSize(6, 1.0, 2.0);
		size7 = setSize(7, cus_h, cus_cyc);
		vertex.z = size1 + size2 + size3 + size4 + size5 + size6 + size7;
	}
	// 凸凹に応じた影を付ける
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	scene.add(ground);
	
	// 回転体（山）
	var points = [
		new THREE.Vector3(0, 0, 25),
		new THREE.Vector3(8, 0, 30),
		new THREE.Vector3(30, 0, -5),
	];
	var geometry = new THREE.LatheGeometry(points, 8);	// pointsで指定した図形を16段階で回転体化
	var yama = new THREE.Mesh(geometry, material);
	yama.rotation.x = -(Math.PI/2.0).toFixed(6);
	if(document.getElementsByName("add")[0].checked)
		scene.add(yama);
	
	// 回転体（山の中）
	var points = [
		new THREE.Vector3(0, 0, 10),
		new THREE.Vector3(20, 0, 10),
		new THREE.Vector3(17, 0, 15),
		new THREE.Vector3(0, 0, 15),
	];
	var geometry = new THREE.LatheGeometry(points, 8);
	var material = new THREE.MeshPhongMaterial({color: 0xaa0000, emissive: 0xaa0000, side: 2});
	var mgm = new THREE.Mesh(geometry, material);
	mgm.rotation.x = -(Math.PI/2.0).toFixed(6);
	if(document.getElementsByName("add")[0].checked)
		scene.add(mgm);
}

/*
** ノイズを作る関数
** 引数：番号, 振幅, 周期
*/
function setSize(No, Height, cycle){
	str = new String();
	str = "size" + No;
	if(document.getElementsByName(str)[0].checked)
		result = Height * simplexNoise.noise( vertex.x / cycle, vertex.y / cycle );
	else
		result = 0;
	return result;
}

/*
** 設定変更を反映
*/
function set() {
	initStats();
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

/*
** レンダリング
*/
function render() {
	requestAnimationFrame(render);
	controls.update(); //マウス操作用
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
	document.getElementsByName("size1")[0].checked = true;
	document.getElementsByName("size2")[0].checked = false;
	document.getElementsByName("size3")[0].checked = true;
	document.getElementsByName("size4")[0].checked = false;
	document.getElementsByName("size5")[0].checked = false;
	document.getElementsByName("size6")[0].checked = false;
	document.getElementsByName("size7")[0].checked = false;
	document.getElementsByName("fog")[0].checked = false;
	document.getElementById("cus_h").value = 20;
	document.getElementById("cus_cyc").value = 64.0;
	document.getElementsByName("size1")[0].focus();
}, false);