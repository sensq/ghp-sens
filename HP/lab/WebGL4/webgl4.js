var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry,material, mesh;
var baseTime = +new Date;
var pauseTime = 0, pause = 1;
var stats;
var Hex = 1.0/255;
var img_flag = 6;
var light_flag1 = true;
var light_flag2 = true;

var img1 = './sea2.jpg';	//テクスチャのURL
var img2 = './hue.png';
var img3 = './hue2.png';
var img4 = './earth.jpg';
var img5 = './miku.jpg';
var img6 = './null.png';

texture1 = new THREE.ImageUtils.loadTexture(img1);
texture2 = new THREE.ImageUtils.loadTexture(img2);
texture3 = new THREE.ImageUtils.loadTexture(img3);
texture4 = new THREE.ImageUtils.loadTexture(img4);
texture5 = new THREE.ImageUtils.loadTexture(img5);
texture6 = new THREE.ImageUtils.loadTexture(img6);

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
	camera.position = new THREE.Vector3(70, 90, 60);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	
	function Track() {
		requestAnimationFrame(Track);
		controls.update();	//マウス操作用
	};
	Track();
}

//画面初期化
function initScene() {   
	scene = new THREE.Scene();
}

//光源の設定
function initLight() {
	light = new THREE.DirectionalLight(0xd5d5d5);
	light.position = new THREE.Vector3(0, 10, 10);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(0, 10, 10);
	scene.add(Hemilight);
	
	//Arealight = new THREE.AreaLight(0xcccccc);
	//Arealight.position = new THREE.Vector3(0, 10, 10);
	//scene.add(Arealight);

	ambient = new THREE.AmbientLight(0x202020);
	scene.add(ambient);
}

function addLight() {
	if(light_flag1==true)
		scene.add(light);
	if(light_flag2==true)
		scene.add(Hemilight);
	//scene.add(Arealight);
	scene.add(ambient);
}

function divRewrite (){
	material.side = 2;
	material.needsUpdate = true;
	
	initScene();
	addLight();
	document.getElementById("inner-right1").innerHTML = ""
	document.getElementById("inner-right2").innerHTML = ""
	document.getElementById("inner-right3").innerHTML =
		'テクスチャ切り替え<br>\
		<label><input type="radio" onclick="Button_Texture2();" name="Button_Texture">カラーマップ1</label>\
		<label><input type="radio" onclick="Button_Texture3();" name="Button_Texture">カラーマップ2</label><br>\
		<label><input type="radio" onclick="Button_Texture1();" name="Button_Texture">海</label>\
		<label><input type="radio" onclick="Button_Texture4();" name="Button_Texture">地球</label>\
		<label><input type="radio" onclick="Button_Texture5();" name="Button_Texture">ミク</label>\
		<label><input type="radio" onclick="Button_Texture6();" name="Button_Texture" checked="checked">無し</label>\
		<hr>\
		<label><input type="checkbox" onclick="Button_Light1();" id="Button_Light1" checked="checked">平行光源</label>'
	document.getElementById("inner-right4").innerHTML =
		'形状切り替え<br>\
		<label><input type="radio" onclick="Button_Shape1();" name="Button_Shape">トーラス</label>\
		<label><input type="radio" onclick="Button_Shape2();" name="Button_Shape">球体</label><br>\
		<label><input type="radio" onclick="Button_Shape3();" name="Button_Shape">立方体</label>\
		<label><input type="radio" onclick="Button_Shape4();" name="Button_Shape" checked="checked">ティーポット</label>\
		<hr>\
		<label><input type="checkbox" onclick="Button_Light2();" id="Button_Light2" checked="checked">半球ライト</label>'
	initDat();
	switch (img_flag){
		case 1:
			material.map = texture1;
			break;
		case 2:
			material.map = texture2;
			break;
		case 3:
			material.map = texture3;
			break;
		case 4:
			material.map = texture4;
			break;
		case 5:
			material.map = texture5;
			break;
		case 6:
			material.map = texture6;
			break;
	}
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//オブジェクトの設定
function initObject() {
	geometry = new THREE.TeapotGeometry(24, 20, 1, 0, 1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0x209120,
		ambient: 0x888888,
		specular: 0xcfcfcf,
		emissive: 0x202020,
		shininess: 90, side: 2, map: texture6
	});
	MS = new MaterialSample();
	
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function initDat(){
	//左列
	gui1 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	
	var f11 = gui1.addFolder('Diffuse / 拡散光');
	f11.add(material.color, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f11.add(material.color, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f11.add(material.color, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f11.open();
	
	var f12 = gui1.addFolder('Ambient / 環境光');
	f12.add(material.ambient, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f12.add(material.ambient, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f12.add(material.ambient, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f12.open();
	
	var f13 = gui1.addFolder('Shininess / ハイライトの大きさ');
	f13.add(material, 'shininess', 0, 400, 1);
	f13.add(material, 'shininess', 10000000, 10000000, 1).name("ハイライトを消す")
	f13.open();
	
	var f14 = gui1.addFolder('Opacity / 透明度');
	f14.add(material, 'transparent').name("透過のON/OFF");
	f14.add(material, 'opacity',0,1,0.1);
	f14.open();
	
	//右列
	gui2 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	
	var f21 = gui2.addFolder('Specular / 鏡面光');
	f21.add(material.specular, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f21.add(material.specular, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f21.add(material.specular, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f21.open();
	
	var f22 = gui2.addFolder('Emissive / 放射光');
	f22.add(material.emissive, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f22.add(material.emissive, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f22.add(material.emissive, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f22.open();
	
	var f24 = gui2.addFolder('Extra');
	f24.add(material, 'wireframe');
	f24.add(material, 'metal');
	f24.add(material, 'wrapAround');
	f24.add(material, 'side').min(0).max(2).step(1);
	f24.add(material, 'needsUpdate');
	f24.open();
	
	//光
	gui3 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	var f31 = gui3.addFolder('DirectionalLight / 平行光源');
	f31.add(light.color, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f31.add(light.color, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f31.add(light.color, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f31.add(light, 'intensity' , 0, 5, 0.1).name("強度");
	f31.open();
	
	var f32 = gui3.addFolder('AmbientLight / 環境光');
	f32.add(ambient.color, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f32.add(ambient.color, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f32.add(ambient.color, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f32.open();
	
	//var f33 = gui3.addFolder('AreaLight / エリアライト');
	//f33.add(Arealight.color, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	//f33.add(Arealight.color, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	//f33.add(Arealight.color, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	//f33.open();
	
	gui4 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	var f41 = gui4.addFolder('HemisphereLightSky / 半球ライティング（上）');
	f41.add(Hemilight.groundColor, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f41.add(Hemilight.groundColor, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f41.add(Hemilight.groundColor, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f41.open();
	
	var f42 = gui4.addFolder('HemisphereLightGround / 半球ライティング（下）');
	f42.add(Hemilight.color, 'r' , 0, 255*Hex, 1*Hex).name("Red");
	f42.add(Hemilight.color, 'g' , 0, 255*Hex, 1*Hex).name("Green");
	f42.add(Hemilight.color, 'b' , 0, 255*Hex, 1*Hex).name("Blue");
	f42.add(Hemilight, 'intensity' , 0, 5, 0.1).name("強度");
	f42.open();
	
	document.getElementById('inner-right1').appendChild(gui1.domElement);
	document.getElementById('inner-right2').appendChild(gui2.domElement);
	document.getElementById('inner-right3').appendChild(gui3.domElement);
	document.getElementById('inner-right4').appendChild(gui4.domElement);
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	
	//回転の停止
	switch (pause) {
	case 0:
		document.getElementById("Button_Startstop").innerHTML = "START";
		break;
	case 1:
		document.getElementById("Button_Startstop").innerHTML = "STOP";
		mesh.rotation.y = 0.3 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //回転
		break;
	}
	
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
	initDat();
	renderer.clear();
	render();
}

//-------------------------
//テクスチャ切り替えボタン
//-------------------------
function Button_func() {
	initScene();
	addLight();
	switch (img_flag){
		case 1:
			material.map = texture1;
			break;
		case 2:
			material.map = texture2;
			break;
		case 3:
			material.map = texture3;
			break;
		case 4:
			material.map = texture4;
			break;
		case 5:
			material.map = texture5;
			break;
		case 6:
			material.map = texture6;
			break;
	}
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	renderer.clear();
	render();
}

function Button_Texture1() {
	img_flag = 1;
	material.map = texture1;
	Button_func();
}

function Button_Texture2() {
	img_flag = 2;
	material.map = texture2;
	Button_func();
}

function Button_Texture3() {
	img_flag = 3;
	material.map = texture3;
	Button_func();
}

function Button_Texture4() {
	img_flag = 4;
	material.map = texture4;
	Button_func();
}

function Button_Texture5() {
	img_flag = 5;
	material.map = texture5;
	Button_func()
}

function Button_Texture6() {
	img_flag = 6;
	material.map = texture6;
	Button_func()
}

//回転STOP/START
function Button_Startstop() {
	switch (pause) {
	case 0:
		pause = 1;
		break;
	case 1:
		pause = 0;
		pauseTime = Date.now();
		break;
	}
}

//形状の変化
function Button_Shape1() {
	geometry = new THREE.TorusGeometry(28, 10, 20, 40);
	Button_func();
}

function Button_Shape2() {
	geometry = new THREE.SphereGeometry(28, 40, 40);
	Button_func();
}

function Button_Shape3() {
	geometry = new THREE.CubeGeometry(28, 28, 28);
	Button_func();
}

function Button_Shape4() {
	geometry = new THREE.TeapotGeometry(24, 20, 1, 0, 1, 1, 1);
	Button_func();
}

function Button_Shape5() {
	geometry = new THREE.TorusKnotGeometry(24, 3, 80, 10, 3, 7);
	Button_func();
}

function Button_Light1() {
	if(light_flag1 == true){
		document.getElementById("Button_Light1").innerHTML = "平行光源を点ける";
		light_flag1 = false;
	}else if(light_flag1 == false){
		document.getElementById("Button_Light1").innerHTML = "平行光源を消す";
		light_flag1 = true;
	}
	Button_func();
}
function Button_Light2() {
	if(light_flag2 == true){
		document.getElementById("Button_Light2").innerHTML = "半球ライトを点ける";
		light_flag2 = false;
	}else if(light_flag2 == false){
		document.getElementById("Button_Light2").innerHTML = "半球ライトを消す";
		light_flag2 = true;
	}
	Button_func();
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
	var element = document.getElementById("Button_Startstop"); 
	element.focus();
}, false);
