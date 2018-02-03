document.write('<script type="text/javascript" src="../util/myTemplate.js"></script>');

var a = 40;	//遠点
var b = 20;	//近点
var e = (a-b)/(a+b);	//離心率

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject() {
	var geometry, material;

	//中央の物体
	geometry = new THREE.CubeGeometry(6, 6, 6);
	material = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh1 = new THREE.Mesh(geometry, material);
	scene.add(mesh1);
	
	//回る方の物体
	geometry = new THREE.CubeGeometry(6, 6, 6);
	material = new THREE.MeshPhongMaterial({
		color: 0x44dddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh2 = new THREE.Mesh(geometry, material);
	scene.add(mesh2);
	
	//軌道の線
	var line_geo = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	line_geo.vertices.push(
		new THREE.Vertex( new THREE.Vector3(
			a*e+a*Math.cos(dw*Math.PI/180),
			b*Math.sin(dw*Math.PI/180),
			0 ))
		);
	}

	var line_mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	line = new THREE.Line(line_geo, line_mat)
	scene.add(line);
}

//レンダリング
function render() {
	var dt = requestAnimationFrame(render) / 15;
	controls.update();	//マウス操作用
	stats.update();

	//自転
	var v = 0.5;	//自転の速度
	mesh1.rotation.y = v * dt;
	mesh2.rotation.y = v * dt;
	
	//公転
	var v = 20;		//公転の速度
	mesh2.position = new THREE.Vector3(
		a*e + a*Math.cos(v*Math.PI/180 * dt),
		b * Math.sin(v*Math.PI/180 * dt),
		0
	);
		
	renderer.render(scene, camera);
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(40, 20, 50);	// カメラ初期化
	initScene();	// シーン初期化
	initLight();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};
