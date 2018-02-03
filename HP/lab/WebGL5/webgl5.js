var Rad = Math.PI/180;

//　宇宙のテクスチャ
var img_Galaxy	= './Galaxy.jpg';
texture_Galaxy	= new THREE.ImageUtils.loadTexture(img_Galaxy);

/*
** 地球を基準としたときの各惑星の定数
** 大きさ, 自転周期, 公転速度, 公転軌道, テクスチャ
*/
function information(size, hertz, velocity, orbital, texture){
	this.size = size;
	this.hertz = hertz;
	this.velocity = 10 * velocity;
	this.orbital = 20 * orbital;
	this.texture = new THREE.ImageUtils.loadTexture(texture);
	return this;
};
Sun = new information(2, null, null, null, './Sun.jpg');
Earth = new information(1, 1, 1, 1, './Earth.jpg');
Mercury = new information(0.383, 0.016, 1.61, 0.39, './Mercury.jpg');
Venus = new information(0.950, 0.004, 1.18, 0.72, './Venus.jpg');
Moon = new information(0.273, 1, 1, 0.1, './Moon.jpg');
Mars = new information(0.532, 0.97, 0.81, 1.52, './Mars.jpg');
Jupiter = new information(10.97, 2.4, 0.44, 5.20, './Jupiter.jpg');

/*
** ☆光源の設定
*/
function initLight() {
	ambient = new THREE.AmbientLight(0xffffff);
	ambient.position = new THREE.Vector3(0, 0, 0);
	scene.add(ambient);
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	//　Galaxy
	geo_Galaxy = new THREE.CubeGeometry(500, 500, 500);
	mat_Galaxy = new THREE.MeshPhongMaterial({
		color: 0xffffff, ambient: 0x444444,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Galaxy
	});
	mesh_Galaxy = new THREE.Mesh(geo_Galaxy, mat_Galaxy);
	scene.add(mesh_Galaxy);
	mat_Galaxy.side = 2;
	
	// 惑星描画
	this.planet = function (name){
		var name = name;
		var geometry = new THREE.SphereGeometry(name.size, 30, 30);
		var material = new THREE.MeshPhongMaterial({
			color: 0xdddddd,
			ambient: 0xaaaaaa,
			specular: 0xcfcfcf,
			emissive: 0xaaaaaa,
			shininess:90,
			metal:true,
			map:name.texture
		});
		var mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}
	// 軌道描画
	this.drawLine = function(name){
		var name = name;
		var dw;
		var Line_geo = new THREE.Geometry();
		for (dw = 0; dw <= 360; dw++){
			var circle = new THREE.Vector3(
				0,
				name.orbital * Math.cos(dw*Rad),
				name.orbital * Math.sin(dw*Rad)
			)
			Line_geo.vertices.push(new THREE.Vertex(circle));
		}
		var Line_mat = new THREE.LineBasicMaterial({
			color: 0x00ffff,
			linewidth: 1
		});
		var Line = new THREE.Line(Line_geo, Line_mat)
		scene.add(Line);
	}
	//　Sun
	mesh_Sun = planet(Sun);
	scene.add(mesh_Sun);
	
	//　Mercury
	mesh_Mercury = planet(Mercury);
	scene.add(mesh_Mercury);
	drawLine(Mercury);
	
	//　Venus
	mesh_Venus = planet(Venus);
	scene.add(mesh_Venus);
	drawLine(Venus);
	
	//　Earth
	mesh_Earth = planet(Earth);
	scene.add(mesh_Earth);
	drawLine(Earth);
	
	//　Moon
	mesh_Moon = planet(Moon);
	scene.add(mesh_Moon);
	
	//　Mars
	mesh_Mars = planet(Mars);
	scene.add(mesh_Mars);
	drawLine(Mars);
	
	//　Jupiter
	mesh_Jupiter = planet(Jupiter);
	scene.add(mesh_Jupiter);
	drawLine(Jupiter);
}

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render) / 15;
	controls.update();	//マウス操作用
	stats.update();
	
	// 自転
	mesh_Mercury.rotation.y = Mercury.hertz * dt;
	mesh_Venus.rotation.y = Venus.hertz * dt;
	mesh_Earth.rotation.y = Earth.hertz * dt;
	mesh_Moon.rotation.y = Moon.hertz * dt;
	mesh_Mars.rotation.y = Mars.hertz * dt;
	mesh_Jupiter.rotation.y = Jupiter.hertz * dt;

	// 惑星の公転
	this.rotatePlanet = function(mesh, name){
		var mesh = mesh;
		var name = name;
		mesh.position.x = 0;
		mesh.position.y = name.orbital * Math.cos(name.velocity * dt * Rad);
		mesh.position.z = name.orbital * Math.sin(name.velocity * dt * Rad);
	}
	// 衛星の公転
	this.rotateSatellite = function(planet, mesh, name){
		var planet = planet;
		var mesh = mesh;
		var name = name;
		mesh.position.x = name.orbital * Math.cos(name.velocity * dt * Rad);
		mesh.position.y = planet.position.y + name.orbital * Math.sin(name.velocity * dt * Rad);
		mesh.position.z = planet.position.z;
	}
	rotatePlanet(mesh_Mercury, Mercury);
	rotatePlanet(mesh_Venus, Venus);
	rotatePlanet(mesh_Earth, Earth);
	rotatePlanet(mesh_Mars, Mars);
	rotatePlanet(mesh_Jupiter, Jupiter);
	rotateSatellite(mesh_Earth, mesh_Moon, Moon);

	renderer.render(scene, camera);
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(15, -30, -10);	// カメラ初期化
	initScene();	// シーン初期化
	initLight();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

//========================
// ここからはボタンなどに関する記述
//========================

//ボタンの設定
function cameraTarget(targetMesh) {
	controls.target = targetMesh.position;
}

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