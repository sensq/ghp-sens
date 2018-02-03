var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;
var stats;
var Hex = 1.0/255;
var Rad = Math.PI/180;

var img_Galaxy	= './Galaxy.jpg';	//テクスチャのURL
var img_Sun		= './Sun.jpg';
var img_Mercury	= './Mercury.jpg';
var img_Venus	= './Venus.jpg';
var img_Earth	= './Earth.jpg';
var img_Moon	= './Moon.jpg';
var img_Mars	= './Mars.jpg';
var img_Jupiter	= './Jupiter.jpg';

texture_Galaxy	= new THREE.ImageUtils.loadTexture(img_Galaxy);
texture_Sun		= new THREE.ImageUtils.loadTexture(img_Sun);
texture_Mercury	= new THREE.ImageUtils.loadTexture(img_Mercury);
texture_Venus	= new THREE.ImageUtils.loadTexture(img_Venus);
texture_Earth	= new THREE.ImageUtils.loadTexture(img_Earth);
texture_Moon	= new THREE.ImageUtils.loadTexture(img_Moon);
texture_Mars	= new THREE.ImageUtils.loadTexture(img_Mars);
texture_Jupiter	= new THREE.ImageUtils.loadTexture(img_Jupiter);

//サイズ
var Size_Earth	 = 1.0;
var Size_Mercury = Size_Earth*0.383;
var Size_Venus	 = Size_Earth*0.950;
var Size_Moon	 = Size_Earth*0.273;
var Size_Mars	 = Size_Earth*0.532;
var Size_Jupiter = Size_Earth*10.97;

//自転の周期
var Rot_Earth	 = 1.0;
var Rot_Mercury	 = Rot_Earth*0.016;
var Rot_Venus	 = Rot_Earth*0.004;
var Rot_Moon	 = Rot_Earth*1;
var Rot_Mars	 = Rot_Earth*0.97;
var Rot_Jupiter	 = Rot_Earth*2.4;

//公転速度
var Vel_Earth	 = 20.0;
var Vel_Mercury	 = Vel_Earth*1.61;
var Vel_Venus	 = Vel_Earth*1.18;
var Vel_Moon	 = Vel_Earth*1;
var Vel_Mars	 = Vel_Earth*0.81;
var Vel_Jupiter	 = Vel_Earth*0.44;

//遠日点
var Aph_Earth	 = 20.0;
var Aph_Mercury	 = Aph_Earth*0.47;
var Aph_Venus	 = Aph_Earth*0.73;
var Aph_Mars	 = Aph_Earth*1.67;
var Aph_Jupiter	 = Aph_Earth*5.46;

//近日点
var Per_Earth	 = 20.0;
var Per_Mercury	 = Per_Earth*0.31;
var Per_Venus	 = Per_Earth*0.72;
var Per_Mars	 = Per_Earth*1.38;
var Per_Jupiter	 = Per_Earth*4.95

//軌道の離心率
var e_Earth		 = (Aph_Earth-Per_Earth)/(Aph_Earth+Per_Earth);
var e_Mercury	 = (Aph_Mercury-Per_Mercury)/(Aph_Mercury+Per_Mercury);
var e_Venus		 = (Aph_Venus-Per_Venus)/(Aph_Venus+Per_Venus);
var e_Mars		 = (Aph_Mars-Per_Mars)/(Aph_Mars+Per_Mars);
var e_Jupiter	 = (Aph_Jupiter-Per_Jupiter)/(Aph_Jupiter+Per_Jupiter);

//月の地球からの距離
var Orb_Moon	 = 2.0;

//描画領域の設定
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div要素のサイズを取得
	Height = document.getElementById('canvas').clientHeight;	//div要素のサイズを取得 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

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
	camera.position = new THREE.Vector3(15, -30, -10);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	controls.target = new THREE.Vector3(0, 0, 0)
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	//light = new THREE.DirectionalLight(0xcccccc);
	//light.position = new THREE.Vector3(0, 2, 0);
	//light.intensity = 10.0;
	//scene.add(light);

	ambient = new THREE.AmbientLight(0xffffff);
	ambient.position = new THREE.Vector3(0, 0, 0);
	scene.add(ambient);
}

//オブジェクトの設定
function initObject() {
	//Galaxy
	geo_Galaxy = new THREE.CubeGeometry(1000, 1000, 1000);
	mat_Galaxy = new THREE.MeshPhongMaterial({
		color: 0xffffff, ambient: 0x444444,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Galaxy
	});
	mesh_Galaxy = new THREE.Mesh(geo_Galaxy, mat_Galaxy);
	scene.add(mesh_Galaxy);
	mat_Galaxy.side = 2;
	
	//Sun
	geo_Sun = new THREE.SphereGeometry(2, 60, 60);
	mat_Sun = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xaaaaaa,
		specular: 0xcfcfcf, emissive: 0xaaaaaa, shininess:90, metal:true, map:texture_Sun
	});
	mesh_Sun = new THREE.Mesh(geo_Sun, mat_Sun);
	mat_Sun.side = 2;
	scene.add(mesh_Sun);
	
	//Mercury
	geo_Mercury = new THREE.SphereGeometry(Size_Mercury, 60, 60);
	mat_Mercury = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Mercury
	});
	mesh_Mercury = new THREE.Mesh(geo_Mercury, mat_Mercury);
	scene.add(mesh_Mercury);
	
	//Venus
	geo_Venus = new THREE.SphereGeometry(Size_Venus, 60, 60);
	mat_Venus = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Venus
	});
	mesh_Venus = new THREE.Mesh(geo_Venus, mat_Venus);
	scene.add(mesh_Venus);
	
	//Earth
	geo_Earth = new THREE.SphereGeometry(Size_Earth, 60, 60);
	mat_Earth = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Earth
	});
	mesh_Earth = new THREE.Mesh(geo_Earth, mat_Earth);
	scene.add(mesh_Earth);
	
	//Moon
	geo_Moon = new THREE.SphereGeometry(Size_Moon, 60, 60);
	mat_Moon = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Moon
	});
	mesh_Moon = new THREE.Mesh(geo_Moon, mat_Moon);
	scene.add(mesh_Moon);
	
	//Mars
	geo_Mars = new THREE.SphereGeometry(Size_Mars, 60, 60);
	mat_Mars = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Mars
	});
	mesh_Mars = new THREE.Mesh(geo_Mars, mat_Mars);
	scene.add(mesh_Mars);
	
	//Jupiter
	geo_Jupiter = new THREE.SphereGeometry(Size_Jupiter, 60, 60);
	mat_Jupiter = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0xbbbbbb,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true, map:texture_Jupiter
	});
	mesh_Jupiter = new THREE.Mesh(geo_Jupiter, mat_Jupiter);
	scene.add(mesh_Jupiter);
	
	//水星の軌道
	Line_geo_Mercury = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	Line_geo_Mercury.vertices.push( new THREE.Vertex( new THREE.Vector3(0,Aph_Mercury*e_Mercury+Aph_Mercury*Math.cos(dw*Rad),Per_Mercury*Math.sin(dw*Rad)) ) );
	}
	Line_mat_Mercury = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	Line_Mercury = new THREE.Line( Line_geo_Mercury, Line_mat_Mercury);
	scene.add( Line_Mercury );
	
	//金星の軌道
	Line_geo_Venus = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	Line_geo_Venus.vertices.push( new THREE.Vertex( new THREE.Vector3(0,Aph_Venus*e_Venus+Aph_Venus*Math.cos(dw*Rad),Per_Venus*Math.sin(dw*Rad)) ) );
	}
	Line_mat_Venus = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	Line_Venus = new THREE.Line( Line_geo_Venus, Line_mat_Venus);
	scene.add( Line_Venus );
	
	//地球の軌道
	Line_geo_Earth = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	Line_geo_Earth.vertices.push( new THREE.Vertex( new THREE.Vector3(0,Aph_Earth*e_Earth+Aph_Earth*Math.cos(dw*Rad),Per_Earth*Math.sin(dw*Rad)) ) );
	}
	Line_mat_Earth = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	Line_Earth = new THREE.Line( Line_geo_Earth, Line_mat_Earth);
	scene.add( Line_Earth );
	
	//火星の軌道
	Line_geo_Mars = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	Line_geo_Mars.vertices.push( new THREE.Vertex( new THREE.Vector3(0,Aph_Mars*e_Mars+Aph_Mars*Math.cos(dw*Rad),Per_Mars*Math.sin(dw*Rad)) ) );
	}
	Line_mat_Mars = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	Line_Mars = new THREE.Line( Line_geo_Mars, Line_mat_Mars);
	scene.add( Line_Mars );
	
	//木星の軌道
	Line_geo_Jupiter = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	Line_geo_Jupiter.vertices.push( new THREE.Vertex( new THREE.Vector3(0,Aph_Jupiter*e_Jupiter+Aph_Jupiter*Math.cos(dw*Rad),Per_Jupiter*Math.sin(dw*Rad)) ) );
	}
	Line_mat_Jupiter = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1});
	Line_Jupiter = new THREE.Line( Line_geo_Jupiter, Line_mat_Jupiter);
	scene.add( Line_Jupiter );
}

//レンダリング
function render() {	
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	
	var step = (+new Date - baseTime) / 1000;
	
	//var Vel_Earth	 = 2*h_Earth/(Math.sqrt(Math.pow(5*Aph_Earth*e_Earth+5*Aph_Earth*Math.cos(Vel_Earth*step*Rad),2)+Math.pow(Per_Earth*Math.sin(Vel_Earth*step*Rad),2))*(Math.sin(step*Rad)));
	//var Vel_Mercury	 = Vel_Earth*1.61;
	//var Vel_Venus	 = Vel_Earth*1.18;
	//var Vel_Moon	 = Vel_Earth*1;
	//var Vel_Mars	 = Vel_Earth*0.81;
	//var Vel_Jupiter	 = Vel_Earth*0.44;
	
	//自転
	mesh_Mercury.rotation.y = Rot_Mercury * step	//回転
	mesh_Venus.rotation.y = Rot_Venus * step	//回転
	mesh_Earth.rotation.y = Rot_Earth * step	//回転
	mesh_Moon.rotation.y = Rot_Moon * step	//回転
	mesh_Mars.rotation.y = Rot_Mars * step	//回転
	mesh_Jupiter.rotation.y = Rot_Jupiter * step	//回転

	//公転
	mesh_Mercury.position=({x:0,y:Aph_Mercury*e_Mercury+Aph_Mercury*Math.cos(Vel_Mercury*step*Rad),z:Per_Mercury*Math.sin(Vel_Mercury*step*Rad)});
	mesh_Venus.position=({x:0,y:Aph_Venus*e_Venus+Aph_Venus*Math.cos(Vel_Venus*step*Rad),z:Per_Venus*Math.sin(Vel_Venus*step*Rad)});
	mesh_Earth.position=({x:0,y:Aph_Earth*e_Earth+Aph_Earth*Math.cos(Vel_Earth*step*Rad),z:Per_Earth*Math.sin(Vel_Earth*step*Rad)});
	mesh_Moon.position=({
		y:mesh_Earth.position.y+Orb_Moon*Math.sin(Vel_Moon*step*Rad),
		z:mesh_Earth.position.z,
		x:Orb_Moon*Math.cos(Vel_Moon*step*Rad)});
	mesh_Mars.position=({x:0,y:Aph_Mars*e_Mars+Aph_Mars*Math.cos(Vel_Mars*step*Rad),z:Per_Mars*Math.sin(Vel_Mars*step*Rad)});
	mesh_Jupiter.position=({x:0,y:Aph_Jupiter*e_Jupiter+Aph_Jupiter*Math.cos(Vel_Jupiter*step*Rad),z:Per_Jupiter*Math.sin(Vel_Jupiter*step*Rad)});

	renderer.render(scene, camera);
}

//実行する関数
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initStats();
	initObject();
	renderer.clear();
	render();
}

//ボタンの設定
function Button_Sun() {
	requestAnimationFrame(Button_Sun);
	controls.target = mesh_Sun.position;
}

function Button_Mercury() {
	requestAnimationFrame(Button_Mercury);
	controls.target = mesh_Mercury.position;
}

function Button_Venus() {
	requestAnimationFrame(Button_Venus);
	controls.target = mesh_Venus.position;
}

function Button_Earth() {
	requestAnimationFrame(Button_Earth);
	controls.target = mesh_Earth.position;
}

function Button_Moon() {
	requestAnimationFrame(Button_Moon);
	controls.target = mesh_Moon.position;
}

function Button_Mars() {
	requestAnimationFrame(Button_Mars);
	controls.target = mesh_Mars.position;
}

function Button_Jupiter() {
	requestAnimationFrame(Button_Jupiter);
	controls.target = mesh_Jupiter.position;
}

//ウィンドウのリサイズに対応
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//フォーカスを合わせる
window.addEventListener('load', function (){
	var element = document.getElementById("Button_Content"); 
	element.focus();
}, false);
