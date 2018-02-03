var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;
var horizon = 18;
var vertical = 16;
var flag_cmy = false;

//描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight;	//div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
};

//FPSの表示
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

//カメラの設定
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(0, 0, 25);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 10);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject() {
	//床
	geo_tile = new Array(horizon);
	for (i = 0; i < geo_tile.length; i++) {
		geo_tile[i] = new Array(vertical);
		for (j = 0; j < geo_tile[i].length; j++) {
			geo_tile[i][j] = new THREE.CubeGeometry(1, 1, 1);
		}
	}
	mat_tile = new Array(horizon);
	for (i = 0; i < mat_tile.length; i++) {
		mat_tile[i] = new Array(vertical);
		for (j = 0; j < mat_tile[i].length; j++) {
			if(i%2 == j%2){
				mat_tile[i][j] = new THREE.MeshPhongMaterial({
					color: 0xaaaaaa
				});
			}else{
				mat_tile[i][j] = new THREE.MeshPhongMaterial({
					color: 0x888888
				});
			}
		}
	}
	mesh_tile = new Array(horizon);
	for (i = 0; i < mesh_tile.length; i++) {
		mesh_tile[i] = new Array(vertical);
		for (j = 0; j < mesh_tile[i].length; j++) {
			mesh_tile[i][j] = new THREE.Mesh(geo_tile[i][j],mat_tile[i][j]);
			scene.add(mesh_tile[i][j]);
			mesh_tile[i][j].position.x = i-horizon/2;
			mesh_tile[i][j].position.y = j-vertical/2;
		}
	}
	
	//動かせる物体1
	geometry1 = new THREE.CubeGeometry(1, 1, 1);
	material1 = new THREE.MeshPhongMaterial({
	  color: 0xff0000
	});
	mesh1 = new THREE.Mesh(geometry1, material1);
	mesh1.position = new THREE.Vector3(-5, -4, 1);
	scene.add(mesh1);
	
	//動かせる物体2
	geometry2 = new THREE.CubeGeometry(1, 1, 1);
	material2 = new THREE.MeshPhongMaterial({
	  color: 0x00ff00
	});
	mesh2 = new THREE.Mesh(geometry2, material2);
	mesh2.position = new THREE.Vector3(-3, 2, 1);
	scene.add(mesh2);
	
	//動かせる物体3
	geometry3 = new THREE.CubeGeometry(1, 1, 1);
	material3 = new THREE.MeshPhongMaterial({
	  color: 0x0000ff
	});
	mesh3 = new THREE.Mesh(geometry3, material3);
	mesh3.position = new THREE.Vector3(4, 4, 1);
	scene.add(mesh3);
	
	//動かせる物体4
	geometry4 = new THREE.CubeGeometry(1, 1, 1);
	material4 = new THREE.MeshPhongMaterial({
	  color: 0x00ffff
	});
	mesh4 = new THREE.Mesh(geometry4, material4);
	mesh4.position = new THREE.Vector3(-6, 7, 1);
	scene.add(mesh4);
	
	//動かせる物体5
	geometry5 = new THREE.CubeGeometry(1, 1, 1);
	material5 = new THREE.MeshPhongMaterial({
	  color: 0xff00ff
	});
	mesh5 = new THREE.Mesh(geometry5, material5);
	mesh5.position = new THREE.Vector3(1, 3, 1);
	scene.add(mesh5);
	
	//動かせる物体6
	geometry6 = new THREE.CubeGeometry(1, 1, 1);
	material6 = new THREE.MeshPhongMaterial({
	  color: 0xffff00
	});
	mesh6 = new THREE.Mesh(geometry6, material6);
	mesh6.position = new THREE.Vector3(4, -4, 1);
	scene.add(mesh6);
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	
	mat_line = new Array(6);
	
	//線R→G
	geo_line = new Array(3);
	geo_line[0] = new THREE.Geometry();
	geo_line[0].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh1.position.x,
		mesh1.position.y,
		mesh1.position.z
	)));    //始点
	geo_line[0].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh2.position.x,
		mesh2.position.y,
		mesh2.position.z
	)));  //終点
	mat_line[0] = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 1});
	
	//線R→B
	geo_line[1] = new THREE.Geometry();
	geo_line[1].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh1.position.x,
		mesh1.position.y,
		mesh1.position.z
	)));    //始点
	geo_line[1].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh3.position.x,
		mesh3.position.y,
		mesh3.position.z
	)));  //終点
	mat_line[1] = new THREE.LineBasicMaterial({ color: 0xcc00cc, linewidth: 1});
	
	//線G→B
	geo_line[2] = new THREE.Geometry();
	geo_line[2].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh2.position.x,
		mesh2.position.y,
		mesh2.position.z
	)));    //始点
	geo_line[2].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh3.position.x,
		mesh3.position.y,
		mesh3.position.z
	)));  //終点
	mat_line[2] = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	
	//線C→M
	geo_line[3] = new THREE.Geometry();
	geo_line[3].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh4.position.x,
		mesh4.position.y,
		mesh4.position.z
	)));    //始点
	geo_line[3].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh5.position.x,
		mesh5.position.y,
		mesh5.position.z
	)));  //終点
	mat_line[3] = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 1});
	
	//線C→Y
	geo_line[4] = new THREE.Geometry();
	geo_line[4].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh4.position.x,
		mesh4.position.y,
		mesh4.position.z
	)));    //始点
	geo_line[4].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh6.position.x,
		mesh6.position.y,
		mesh6.position.z
	)));  //終点
	mat_line[4] = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 1});
	
	//線M→Y
	geo_line[5] = new THREE.Geometry();
	geo_line[5].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh5.position.x,
		mesh5.position.y,
		mesh5.position.z
	)));    //始点
	geo_line[5].vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh6.position.x,
		mesh6.position.y,
		mesh6.position.z
	)));  //終点
	mat_line[5] = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	
	line = new Array(6);
	line[0] = new THREE.Line(geo_line[0], mat_line[0]);
	line[1] = new THREE.Line(geo_line[1], mat_line[1]);
	line[2] = new THREE.Line(geo_line[2], mat_line[2]);
	line[3] = new THREE.Line(geo_line[3], mat_line[3]);
	line[4] = new THREE.Line(geo_line[4], mat_line[4]);
	line[5] = new THREE.Line(geo_line[5], mat_line[5]);
	
	scene.add(line[0]);
	scene.add(line[1]);
	scene.add(line[2]);
	scene.add(line[3]);
	scene.add(line[4]);
	scene.add(line[5]);
	
	renderer.render(scene, camera);
	
	scene.remove(line[0]);
	scene.remove(line[1]);
	scene.remove(line[2]);
	scene.remove(line[3]);
	scene.remove(line[4]);
	scene.remove(line[5]);
}

//実行する関数
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

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

document.onkeydown = function(e) { 
	var shift, ctrl;
	ctrl = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
	shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;
	
	// キーコードの文字を取得 
	keycode = e.which;
	keychar = String.fromCharCode(keycode).toUpperCase();
	
	//チェック状態変化用
	var checks=document.getElementsByName("mode");
	
	if(keychar == "Q") {	//left
		if(flag_cmy == false){
			checks[0].checked=true;
			flag_cmy = true;
		}
		else if(flag_cmy == true){
			checks[0].checked=false;
			flag_cmy = false; 
		}
	}
	
	if(flag_cmy == false){
		if(ctrl){
			if(keycode == "37") {	//left
				if(mesh3.position.x > -horizon/2)
					mesh3.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh3.position.y < vertical/2-1)
					mesh3.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh3.position.x < horizon/2-1)
					mesh3.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh3.position.y > -vertical/2)
					mesh3.position.y -= 1;
			}else if(keychar == "Z"){
				mesh3.scale.z += 1;
				mesh3.position.z += 0.5;
			}else if(keychar == "X"){
				mesh3.scale.z -= 1;
				mesh3.position.z -= 0.5;
			}
		}else if(shift){
			if(keycode == "37") {	//left
				if(mesh2.position.x > -horizon/2)
					mesh2.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh2.position.y < vertical/2-1)
					mesh2.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh2.position.x < horizon/2-1)
					mesh2.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh2.position.y > -vertical/2)
					mesh2.position.y -= 1;
			}else if(keychar == "Z"){
				mesh2.scale.z += 1;
				mesh2.position.z += 0.5;
			}else if(keychar == "X"){
				mesh2.scale.z -= 1;
				mesh2.position.z -= 0.5;
			}
		}else{
			if(keycode == "37") {	//left
				if(mesh1.position.x > -horizon/2)
					mesh1.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh1.position.y < vertical/2-1)
					mesh1.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh1.position.x < horizon/2-1)
					mesh1.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh1.position.y > -vertical/2)
					mesh1.position.y -= 1;
			}else if(keychar == "Z"){
				mesh1.scale.z += 1;
				mesh1.position.z += 0.5;
			}else if(keychar == "X"){
				mesh1.scale.z -= 1;
				mesh1.position.z -= 0.5;
			}
		}
	}else if(flag_cmy ==true){
		if(ctrl){
			if(keycode == "37") {	//left
				if(mesh6.position.x > -horizon/2)
					mesh6.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh6.position.y < vertical/2-1)
					mesh6.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh6.position.x < horizon/2-1)
					mesh6.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh6.position.y > -vertical/2)
					mesh6.position.y -= 1;
			}else if(keychar == "Z"){
				mesh6.scale.z += 1;
				mesh6.position.z += 0.5;
			}else if(keychar == "X"){
				mesh6.scale.z -= 1;
				mesh6.position.z -= 0.5;
			}
		}else if(shift){
			if(keycode == "37") {	//left
				if(mesh5.position.x > -horizon/2)
					mesh5.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh5.position.y < vertical/2-1)
					mesh5.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh5.position.x < horizon/2-1)
					mesh5.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh5.position.y > -vertical/2)
					mesh5.position.y -= 1;
			}else if(keychar == "Z"){
				mesh5.scale.z += 1;
				mesh5.position.z += 0.5;
			}else if(keychar == "X"){
				mesh5.scale.z -= 1;
				mesh5.position.z -= 0.5;
			}
		}else{
			if(keycode == "37") {	//left
				if(mesh4.position.x > -horizon/2)
					mesh4.position.x -= 1;
			}else if(keycode == "38"){	//up
				if(mesh4.position.y < vertical/2-1)
					mesh4.position.y += 1;
			}else if(keycode == "39"){	//right
				if(mesh4.position.x < horizon/2-1)
					mesh4.position.x += 1;
			}else if(keycode == "40"){	//down
				if(mesh4.position.y > -vertical/2)
					mesh4.position.y -= 1;
			}else if(keychar == "Z"){
				mesh4.scale.z += 1;
				mesh4.position.z += 0.5;
			}else if(keychar == "X"){
				mesh4.scale.z -= 1;
				mesh4.position.z -= 0.5;
			}
		}
	}
}

//モード切り替えボタン
function mode() {
	if(flag_cmy == false)
		flag_cmy = true;
	else if(flag_cmy == true)
		flag_cmy = false; 
}

function sort1() {	//デフォルト
	mesh1.scale.z = 1;
	mesh2.scale.z = 1;
	mesh3.scale.z = 1;
	mesh4.scale.z = 1;
	mesh5.scale.z = 1;
	mesh6.scale.z = 1;
	mesh1.position = new THREE.Vector3(-5,-4,1);
	mesh2.position = new THREE.Vector3(-3,2,1);
	mesh3.position = new THREE.Vector3(4,4,1);
	mesh4.position = new THREE.Vector3(-6,7,1);
	mesh5.position = new THREE.Vector3(1,3,1);
	mesh6.position = new THREE.Vector3(4,-4,1);
}

function sort2() {	//横一列
	mesh1.scale.z = 1;
	mesh2.scale.z = 1;
	mesh3.scale.z = 1;
	mesh4.scale.z = 1;
	mesh5.scale.z = 1;
	mesh6.scale.z = 1;
	mesh1.position = new THREE.Vector3(-3,0,1);
	mesh2.position = new THREE.Vector3(-2,0,1);
	mesh3.position = new THREE.Vector3(-1,0,1);
	mesh4.position = new THREE.Vector3(0,0,1);
	mesh5.position = new THREE.Vector3(1,0,1);
	mesh6.position = new THREE.Vector3(2,0,1);
}

function sort3() {	//階段
	mesh1.scale.z = 1;
	mesh2.scale.z = 2;
	mesh3.scale.z = 3;
	mesh4.scale.z = 4;
	mesh5.scale.z = 5;
	mesh6.scale.z = 6;
	mesh1.position = new THREE.Vector3(-3,0,1);
	mesh2.position = new THREE.Vector3(-2,0,1.5);
	mesh3.position = new THREE.Vector3(-1,0,2);
	mesh4.position = new THREE.Vector3(0,0,2.5);
	mesh5.position = new THREE.Vector3(1,0,3);
	mesh6.position = new THREE.Vector3(2,0,3.5);
}

function sort4() {	//六芒星
	mesh1.scale.z = 1;
	mesh2.scale.z = 1;
	mesh3.scale.z = 1;
	mesh4.scale.z = 1;
	mesh5.scale.z = 1;
	mesh6.scale.z = 1;
	mesh1.position = new THREE.Vector3(0, vertical/2-1, 1);
	mesh2.position = new THREE.Vector3(-horizon/2, -vertical/2+3, 1);
	mesh3.position = new THREE.Vector3(horizon/2-1, -vertical/2+3, 1);
	mesh4.position = new THREE.Vector3(0, -vertical/2, 1);
	mesh5.position = new THREE.Vector3(-horizon/2, vertical/2-4, 1);
	mesh6.position = new THREE.Vector3(horizon/2-1, vertical/2-4, 1);
}

//更新時にチェックボックスのチェックを外す
window.addEventListener('load', function (){
	var checks=document.getElementsByName("mode");
	checks[0].checked=false;
	
	checks[0].focus(); // カーソルを合わせる 
}, false);
