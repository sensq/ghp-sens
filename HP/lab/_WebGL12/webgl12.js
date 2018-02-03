var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var x, y, z;
var vx, vy, vz;
var dt;
var loop = 0;
var type = 0;

var img_floor = './gray.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

// 描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth; //div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight; //div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	renderer.shadowMapEnabled = true;
}
// FPSの表示
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';	//上からの位置
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

// カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(0, 0, cam_pos_z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

// 画面初期化
function initScene() {
	scene = new THREE.Scene();
}

// 光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(10, -40, 20);
	scene.add(light);
	Hemilight = new THREE.HemisphereLight(0x555555, 0x222222);
	Hemilight.position = new THREE.Vector3(10, -40, 20);
	scene.add(Hemilight);
	ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);
}

// オブジェクトの設定
function initObject() {
	point_geo = new THREE.SphereGeometry(0.3, 25, 25);
	point_mat = new THREE.MeshPhongMaterial({
		color: 0x00ff99,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	point_mesh = new THREE.Mesh(point_geo, point_mat);
	point_mesh.scale = new THREE.Vector3(p_sc, p_sc, p_sc);
	scene.add(point_mesh);
	
	sky_geo = new THREE.SphereGeometry(2000, 25, 25);
	sky_mat = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaaa,
		specular: 0x000000,
		shininess: 90,
		metal: true,
		side: 2
	});
	sky_mesh = new THREE.Mesh(sky_geo, sky_mat);
	scene.add(sky_mesh);
	
	floor_geo = new THREE.CubeGeometry(100, 100, 1);
	floor_mat = new THREE.MeshPhongMaterial({
		color: 0xaaaaaa,
		ambient: 0xaaaaaa,
		specular: 0x555555,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture_floor
	});
	floor_mesh = new THREE.Mesh(floor_geo, floor_mat);
	floor_mesh.rotation = new THREE.Vector3(-1, 0, 0);
	floor_mesh.position = new THREE.Vector3(0, -20, 0);
	scene.add(floor_mesh);
}

// ルンゲクッタに使う初期値を変数に代入
function runge_kutta_start() {
	loop = 0;
	target = document.getElementById("x");
	x = Number(target.value);
	document.getElementById("var_x").value = target;
	target = document.getElementById("y");
	y = Number(target.value);
	document.getElementById("var_y").value = y;
	target = document.getElementById("z");
	z = Number(target.value);
	document.getElementById("var_z").value = z;
	target = document.getElementById("vx");
	vx = Number(target.value);
	document.getElementById("var_vx").value = vx;
	target = document.getElementById("vy");
	vy = Number(target.value);
	document.getElementById("var_vy").value = vy;
	target = document.getElementById("vz");
	vz = Number(target.value);
	document.getElementById("var_vz").value = vz;
	target = document.getElementById("dt");
	dt = Number(target.value);
	target = document.getElementById("gamm");
	gamm = Number(target.value);
	target = document.getElementById("spr");
	spr = Number(target.value);
	initCamera();
	initScene();
	initStats();
	initLight();
	initObject();
	renderer.clear();
	render();
}

// ルンゲクッタの計算
function runge_kutta() {
	loop += 1;
	var ax = new Array(5);
	var ay = new Array(5);
	var az = new Array(5);
	var bvx = new Array(5);
	var bvy = new Array(5);
	var bvz = new Array(5);
	// 1次の項の計算
	ax[1] = this.Fx(x, y, z, vx, vy, vz) * dt;
	ay[1] = this.Fy(x, y, z, vx, vy, vz) * dt;
	az[1] = this.Fz(x, y, z, vx, vy, vz) * dt;
	bvx[1] = this.Gx(x, y, z, vx, vy, vz) * dt;
	bvy[1] = this.Gy(x, y, z, vx, vy, vz) * dt;
	bvz[1] = this.Gz(x, y, z, vx, vy, vz) * dt;
	// 2次の項の計算
	ax[2] = this.Fx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	ay[2] = this.Fy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	az[2] = this.Fz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvx[2] = this.Gx(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvy[2] = this.Gy(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	bvz[2] = this.Gz(x + bvx[1] / 2, y + bvy[1] / 2, z + bvz[1] / 2, vx + ax[1] / 2, vy + ay[1] / 2, vz + az[1] / 2) * dt;
	// 3次の項の計算
	ax[3] = this.Fx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	ay[3] = this.Fy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	az[3] = this.Fz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvx[3] = this.Gx(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvy[3] = this.Gy(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	bvz[3] = this.Gz(x + bvx[2] / 2, y + bvy[2] / 2, z + bvz[2] / 2, vx + ax[2] / 2, vy + ay[2] / 2, vz + az[2] / 2) * dt;
	// 4次の項の計算
	ax[4] = this.Fx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	ay[4] = this.Fy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	az[4] = this.Fz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvx[4] = this.Gx(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvy[4] = this.Gy(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	bvz[4] = this.Gz(x + bvx[3], y + bvy[3], z + bvz[3], vx + ax[3], vy + ay[3], vz + az[3]) * dt;
	// 位置と速度の次の値を計算
	this.x = x + (bvx[1] + 2 * bvx[2] + 2 * bvx[3] + bvx[4]) / 6;
	this.y = y + (bvy[1] + 2 * bvy[2] + 2 * bvy[3] + bvy[4]) / 6;
	this.z = z + (bvz[1] + 2 * bvz[2] + 2 * bvz[3] + bvz[4]) / 6;
	this.vx = vx + (ax[1] + 2 * ax[2] + 2 * ax[3] + ax[4]) / 6;
	this.vy = vy + (ay[1] + 2 * ay[2] + 2 * ay[3] + ay[4]) / 6;
	this.vz = vz + (az[1] + 2 * az[2] + 2 * az[3] + az[4]) / 6;
	target = document.getElementById("var_x");
	target.value = x.toFixed(6);
	target = document.getElementById("var_y");
	target.value = y.toFixed(6);
	target = document.getElementById("var_z");
	target.value = z.toFixed(6);
	target = document.getElementById("var_vx");
	target.value = vx.toFixed(6);
	target = document.getElementById("var_vy");
	target.value = vy.toFixed(6);
	target = document.getElementById("var_vz");
	target.value = vz.toFixed(6);
	target = document.getElementById("loop");
	target.value = loop;
}

// ローレンツ方程式の定数
var Lorenz_Const = function(){
	this.p = 10;
	this.r = 28;
	this.b = 8.0/3.0;
};
lorenz_const = new Lorenz_Const();

// ここからルンゲクッタで使う関数
function Fx(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return vy - x / (r * r * r);
		break;
		
		case 2:
			return -spr*x-gamm*vx;
		break;
	}
}
function Fy(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return -vx - y / (r * r * r);
		break;
		
		case 2:
			return -spr*y-gamm*vy;
		break;
	}
}
function Fz(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			return 0;
		break;
		
		case 1:
			var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			return -z / (r * r * r);
		break;
		
		case 2:
			return -spr*z-gamm*vz;
		break;
	}
}
function Gx(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			this.p = lorenz_const.p;
			return -p*x+p*y;
		break;
		
		case 1:
			return vx;
		break;
		
		case 2:
			return vx;
		break;
	}
}
function Gy(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			this.r = lorenz_const.r;
			return -x*z+r*x-y;
		break;
		
		case 1:
			return vy;
		break;
		
		case 2:
			return vy;
		break;
	}
}
function Gz(x, y, z, vx, vy, vz) {
	switch(type){
		case 0:
			this.b = lorenz_const.b;
			return x*y-b*z;
		break;
		
		case 1:
			return vz;
		break;
		
		case 2:
			return vz;
		break;
	}
}

// レンダリング
function render() {
	target = document.getElementById("skip");
	skip = target.value;
	requestAnimationFrame(render);
	controls.update(); // マウス操作用
	
	// 軌跡を描画する
	var geometry = new THREE.Geometry();
	
	// skipの値分だけ描画をスキップ（dtを大きくするのとは意味が違う）
	for(i=0; i<skip; i++){
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));    // 始点
		
		runge_kutta(x, y, z, vx, vy, vz, dt);
		
		point_mesh.position = new THREE.Vector3(x, y, z);
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));  // 終点
		material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	}
	
	line = new THREE.Line(geometry, material)
	scene.add(line);
	renderer.render(scene, camera);
}

// 実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initStats();
	initLight();
	initObject();
	renderer.clear();
	render();
}

// 微分方程式の種類を変える
function Button_type(flag) {
	switch(flag){
		case 'Lorenz_equation':
			setLorenz_equation();
			type = 0;
		break;
		
		case 'Lorentz_force':
			setLorentz_force();
			type = 1;
		break;
		
		case 'damped_vibration':
			setvibration();
			type = 2;
		break;
	}
	runge_kutta_start();
}

// 最適な値にセット
function setLorenz_equation() {
	cam_pos_z = 90;	// カメラの位置を変更
	p_sc = 3;	// スフィアのサイズを変更
	target = document.getElementById("x");
	target.value = 1.0;
	target = document.getElementById("y");
	target.value = 1.0;
	target = document.getElementById("z");
	target.value = 1.0;
	target = document.getElementById("vx");
	target.value = 0.0;
	target = document.getElementById("vy");
	target.value = 0.0;
	target = document.getElementById("vz");
	target.value = 0.0;
	target = document.getElementById("dt");
	target.value = 0.05;
}
function setLorentz_force() {
	cam_pos_z = 10;
	p_sc = 0.7;
	target = document.getElementById("x");
	target.value = 1.0;
	target = document.getElementById("y");
	target.value = 1.0;
	target = document.getElementById("z");
	target.value = 0.5;
	target = document.getElementById("vx");
	target.value = 0.0;
	target = document.getElementById("vy");
	target.value = 0.0;
	target = document.getElementById("vz");
	target.value = 0.5;
	target = document.getElementById("dt");
	target.value = 0.1;
}
function setvibration() {
	cam_pos_z = 4;
	p_sc = 0.3;
	target = document.getElementById("x");
	target.value = 1.0;
	target = document.getElementById("y");
	target.value = 1.0;
	target = document.getElementById("z");
	target.value = 0.5;
	target = document.getElementById("vx");
	target.value = 1.0;
	target = document.getElementById("vy");
	target.value = 0.0;
	target = document.getElementById("vz");
	target.value = 0.5;
	target = document.getElementById("dt");
	target.value = 0.1;
	target = document.getElementById("gamm");
	target.value = 0.1;
	target = document.getElementById("spr");
	target.value = 1.0;
}

// ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

// 初期値を入力&フォーカスを合わせる
window.addEventListener('load', function() {
	target = document.getElementById("start");
	target.focus();
	target = document.getElementById("skip");
	target.value = 1;
	setLorenz_equation();
	runge_kutta_start();
}, false);