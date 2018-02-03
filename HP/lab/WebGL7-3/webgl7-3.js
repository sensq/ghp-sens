var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;
var horizon = 18;
var vertical = 16;
var flag_cmy = false;

var img1 = './metal.jpg';
var img2 = './sprite0.jpg';
var img3 = './nz.jpg';
texture1 = new THREE.ImageUtils.loadTexture(img1);
texture2 = new THREE.ImageUtils.loadTexture(img2);
texture3 = new THREE.ImageUtils.loadTexture(img3);

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
	camera.position = new THREE.Vector3(-horizon/2+4, -vertical/2-4, 14);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	controls.noPan = true;
	controls.minDistance = 4;
	controls.maxDistance = 190;
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
	subscene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 10);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//衝突判定用のフラグ初期設定（兼リセット）
function collision_set(){
	flag_collision = new Array(horizon);
	for (i = 0; i < flag_collision.length; i++) {
		flag_collision[i] = new Array(vertical);
		for (j = 0; j < flag_collision[i].length; j++) {
			flag_collision[i][j] = false;
		}
	}
}

//壁を設置
function wall(x, y){
	var i,j;
	i = x - horizon/2;
	j = y - vertical/2;
	
	//壁用オブジェ
	geo_wall = new THREE.CubeGeometry(1, 1, 1);
	mat_wall = new THREE.MeshPhongMaterial({
		color: 0x0000cc,
		map: texture1
	});
	mesh_wall = new THREE.Mesh(geo_wall, mat_wall);
	mesh_wall.position = new THREE.Vector3(i, j, 1);
	scene.add(mesh_wall);
	
	flag_collision[x][y] = true;
}

function wall_set(){
	//外枠
	for(i=0; i<horizon; i++){
		wall(i, vertical-1);
	}
	for(j=2; j<vertical-1; j++){
		wall(horizon-1, j);
	}
	for(i=0; i<horizon; i++){
		wall(i, 0);
	}
	for(j=2; j<vertical-1; j++){
		wall(0, j);
	}
	//内側
	for(j=1; j<vertical-2; j++){
		wall(3, j);
	}
	for(i=3; i<horizon-2; i++){
		wall(i, vertical-3);
	}
	for(i=5; i<horizon-2; i++){
		wall(i, vertical-5);
	}
	for(j=2; j<vertical-5; j++){
		wall(8, j);
	}
	for(j=2; j<vertical-7; j++){
		wall(13, j);
	}
	for(i=10; i<horizon-5; i++){
		wall(i, vertical-7);
	}
	
	wall(1, 2);
	wall(2, 4);
	wall(1, 6);
	wall(2, 8);
	wall(2, 9);
	wall(2, 10);
	wall(1, 12);
	wall(1, 13);
	wall(1, 14);
	wall(15, 10);
	wall(horizon-2, 2);
	wall(horizon-4, 4);
}

//オブジェクトの設定
function initObject() {
	collision_set();
	wall_set();
	
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
					color: 0x66aa66
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
	//ここまで床
	
	//動かせるオブジェ
	geometry1 = new THREE.SphereGeometry(0.5, 10, 10);
	material1 = new THREE.MeshPhongMaterial({
	  color: 0xffffff,
	  map: texture2
	});
	mesh1 = new THREE.Mesh(geometry1, material1);
	mesh1.position = new THREE.Vector3(-horizon/2-1, -vertical/2+1, 1);
	scene.add(mesh1);
	
	//実は床
	geometry3 = new THREE.CubeGeometry(1, 1, 0.1);
	material3 = new THREE.MeshPhongMaterial({
	  color: 0x0000cc,
	  map: texture1
	});
	mesh3 = new THREE.Mesh(geometry3, material3);
	mesh3.position = new THREE.Vector3(6, -5, 0.5);
	scene.add(mesh3);
	
	//skybox
	geo_sky = new THREE.SphereGeometry(200, 20, 20);
	mat_sky = new THREE.MeshPhongMaterial({
	  color: 0xffffff,
	  map: texture3
	});
	mat_sky.side = 2;
	mesh_sky = new THREE.Mesh(geo_sky, mat_sky);
	mesh_sky.position = new THREE.Vector3(0, 0, 0);
	scene.add(mesh_sky);
	
	controls.target = mesh1.position;
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	
	renderer.render(scene, camera);
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
	
	//移動の可否の判断
	function judge(mesh_name, course){
		switch(course){
		case 0:	//left
			if(mesh_name.position.x > -horizon/2 & flag_collision[mesh_name.position.x + horizon/2 - 1][mesh_name.position.y + vertical/2] != true){
			mesh_name.position.x -= 1;
			camera.position.x -= 1;
			}
			break;
		
		case 1:	//up
			if(mesh_name.position.y < vertical/2 - 1 & flag_collision[mesh_name.position.x + horizon/2][mesh_name.position.y + vertical/2 + 1] != true){
			mesh_name.position.y += 1;
			camera.position.y += 1;
			}
			break;
			
		case 2:	//right
			if(mesh_name.position.x < horizon/2 & flag_collision[mesh_name.position.x + horizon/2 + 1][mesh_name.position.y + vertical/2] != true){
			mesh_name.position.x += 1;
			camera.position.x += 1;
			}
			break;
			
		case 3:	//down
			if(mesh_name.position.y > -vertical/2 & flag_collision[mesh_name.position.x + horizon/2][mesh_name.position.y + vertical/2 - 1] != true){
			mesh_name.position.y -= 1;
			camera.position.y -= 1;
			}
			break;
		}
	}

	//移動用関数
	function move(mesh_name){
		if(keycode == "37") {	//left
			judge(mesh_name, 0);
		}else if(keycode == "38"){	//up
			judge(mesh_name, 1);
		}else if(keycode == "39"){	//right
			judge(mesh_name, 2);
		}else if(keycode == "40"){	//down
			judge(mesh_name, 3);
		}else if(keychar == "Z"){
			mesh_name.scale.z += 1;
			mesh_name.position.z += 0.5;
		}else if(keychar == "X"){
			mesh_name.scale.z -= 1;
			mesh_name.position.z -= 0.5;
		}
	}
	move(mesh1);
}

//更新時にチェックボックスのチェックを外す
window.addEventListener('load', function (){
	var element = document.getElementById("Button_Content"); 
	element.focus();
}, false);
