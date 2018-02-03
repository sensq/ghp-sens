var baseTime = +new Date;
var pauseTime = 0, pause = 1;
var Hex = 1.0/255;

var img = [];
img[0] = './sea2.jpg';	//テクスチャのURL
img[1] = './hue.png';
img[2] = './hue2.png';
img[3] = './earth.jpg';
img[4] = './miku.jpg';
img[5] = './null.png';

var texture = [];
texture[0] = new THREE.ImageUtils.loadTexture(img[0]);
texture[1] = new THREE.ImageUtils.loadTexture(img[1]);
texture[2] = new THREE.ImageUtils.loadTexture(img[2]);
texture[3] = new THREE.ImageUtils.loadTexture(img[3]);
texture[4] = new THREE.ImageUtils.loadTexture(img[4]);
texture[5] = new THREE.ImageUtils.loadTexture(img[5]);

var Knot = {
	p: 3,
	q: 7,
	height: 1
};
//光源の設定
function originalLight() {
	PointLight = new THREE.PointLight(0xd5d5d5);
	PointLight.position = new THREE.Vector3(25, 25, 25);
	scene.add(PointLight);
	
	HemiLight = new THREE.HemisphereLight(0x999999, 0x666666);
	HemiLight.position = PointLight.position;
	scene.add(HemiLight);

	AmbientLight = new THREE.AmbientLight(0x202020);
	scene.add(AmbientLight);
}

function addLight() {
	scene.add(PointLight);
	scene.add(HemiLight);
	scene.add(AmbientLight);
}

function recreateDat (){
	document.getElementById('LeftDat').innerHTML = "";
	document.getElementById('RightDat').innerHTML = "";
	initDat();
}

//オブジェクトの設定
function initObject() {
	var geometry = new THREE.TeapotGeometry(24, 20, 1, 0, 1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0x209120,
		ambient: 0x888888,
		specular: 0xcfcfcf,
		emissive: 0x000000,
		shininess: 90, 
		side: 2,
		bumpScale: 0.4
	});
	MS = new MaterialSample();
	
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.material.map = texture[5];
	mesh.material.bumpMap = texture[5];
	scene.add(mesh);

	var geometry = new THREE.CubeGeometry(3, 3, 3);
	var materialC = new THREE.MeshPhongMaterial({
		color: 0x993333,
		side: 2,
	});
	meshC = new THREE.Mesh(geometry, materialC);
	scene.add(meshC);
	meshC.position = PointLight.position;
}

function initDat(){
	//左列
	gui1 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	// 値を取得
	var color = "#" + mesh.material.color.getHexString();
	var ambient = "#" + mesh.material.ambient.getHexString();
	var specular = "#" + mesh.material.specular.getHexString();
	var emissive = "#" + mesh.material.emissive.getHexString();
	var parameters = {
		color: color,
		ambient: ambient,
		specular: specular,
		emissive: emissive,
	};
	var f11 = gui1.addFolder('material / 物体の色');
	// Diffuse
	var color = f11.addColor(parameters, 'color').name("Diffuse / 拡散光").listen();
	color.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.color.setHex(value);
	});
	// Ambient
	var ambient = f11.addColor(parameters, 'ambient').name("Ambient / 環境光").listen();
	ambient.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.ambient.setHex(value);
	});
	// Specular
	var specular = f11.addColor(parameters, 'specular').name("Specular / 鏡面光").listen();
	specular.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.specular.setHex(value);
	});
	// Emissive
	var emissive = f11.addColor(parameters, 'emissive').name("Emissive / 放射光").listen();
	emissive.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.emissive.setHex(value);
	});
	f11.open();
	
	// Shininess
	var pShininess = {
		shininess: mesh.material.shininess,
		HighLight: HighLight = false
	};
	var f12 = gui1.addFolder('Shininess / ハイライトの大きさ');
	var setShininess = f12.add(pShininess, 'shininess', 0, 100, 1);
	setShininess.onChange(function(value){
		if(!pShininess.HighLight)
			mesh.material.shininess = value;
	});
	var delHighLight = f12.add(pShininess, 'HighLight').name("ハイライトを消す")
	delHighLight.onChange(function(){
		if(pShininess.HighLight)
			mesh.material.shininess = 10000000;
		else
			mesh.material.shininess = pShininess.shininess;
	});
	f12.open();
	
	// Extra
	var Bump = {
		onBump: onBump = true
	};
	var f13 = gui1.addFolder('Extra / その他');
	f13.add(mesh.material, 'wireframe');
	var onBump = f13.add(Bump, 'onBump').name("バンプマップ")
	onBump.onChange(function(){
		if(Bump.onBump)
			mesh.material.bumpScale = 0.4;
		else
			mesh.material.bumpScale = 0;
	});
	var textureNumber = {
		n: 5
	}
	var changeTexture = f13.add(textureNumber, 'n', {カラーマップ1:1, カラーマップ2:2, 海:0, 地球:3, ミク:4, 無し:5}).name("テクスチャー")
	changeTexture.onChange(function(value){
		value = parseInt(value);
		mesh.material.map = texture[value];
		mesh.material.bumpMap = texture[value];
	});
	var geometryType = {
		type: "Teapot"
	}
	var changeTexture = f13.add(geometryType, 'type', {平面:'Plane', トーラス:'Torus', 球:'Sphere', 立方体:'Cube', ティーポット:'Teapot', トーラス結び目:'TorusKnot'}).name("形状")
	changeTexture.onChange(function(value){
		Button_Shape(value);
	});
	f13.open();

	//右列
	gui2 = new dat.GUI(); // dat.GUI クラスのオブジェクトを宣言
	var f21 = gui2.addFolder('Light / 光源の色');

	// 値を取得
	var lightColor = "#" + PointLight.color.getHexString();
	var ambientColor = "#" + AmbientLight.color.getHexString();
	var hemiColor = "#" + HemiLight.color.getHexString();
	var hemiGroundColor = "#" + HemiLight.groundColor.getHexString();
	var parametersLight = {
		light: lightColor,
		ambient: ambientColor,
		hemi: hemiColor,
		hemiGround: hemiGroundColor,
	};
	// 点光源
	var poiLight = f21.addColor(parametersLight, 'light').name("点光源").listen();
	poiLight.onChange(function(value){
		value = value.replace("#", "0x");
		PointLight.color.setHex(value);
	});
	// 環境光
	var ambLight = f21.addColor(parametersLight, 'ambient').name("環境光").listen();
	ambLight.onChange(function(value){
		value = value.replace("#", "0x");
		AmbientLight.color.setHex(value);
	});
	// 半球光源
	var hemiLight = f21.addColor(parametersLight, 'hemi').name("半球ライト（上）").listen();
	hemiLight.onChange(function(value){
		value = value.replace("#", "0x");
		HemiLight.color.setHex(value);
	});
	var hemiGLight = f21.addColor(parametersLight, 'hemiGround').name("半球ライト（下）").listen();
	hemiGLight.onChange(function(value){
		value = value.replace("#", "0x");
		HemiLight.groundColor.setHex(value);
	});
	f21.open();

	// 極座標に変換
	var radius = Math.round(Math.sqrt(Math.pow(PointLight.position.x, 2) + Math.pow(PointLight.position.y, 2) + Math.pow(PointLight.position.z, 2)));
	var theta = Math.round(90/Math.PI * Math.acos(PointLight.position.x/(Math.pow(PointLight.position.x, 2) + Math.pow(PointLight.position.y, 2))));
	var phi = Math.round(180/Math.PI * Math.acos(PointLight.position.z/radius));

	var position = {
		r:radius,
		theta: theta,
		phi: phi
	};
	this.LightPosition = function(){
		PointLight.position.x = position.r * Math.sin(position.theta*Math.PI/180) * Math.cos(position.phi*Math.PI/180);
		PointLight.position.y = position.r * Math.cos(position.theta*Math.PI/180);
		PointLight.position.z = position.r * Math.sin(position.theta*Math.PI/180) * Math.sin(position.phi*Math.PI/180);
	}
	var f22 = gui2.addFolder('Position / 光源の位置');
	var radius = f22.add(position, 'r', 1, 200).name("距離").step(1);
	radius.onChange(function(value){
		position.r = value;
		LightPosition();
	});
	var theta = f22.add(position, 'theta', -180, 180).name("緯度").step(1);
	theta.onChange(function(value){
		position.theta = value;
		LightPosition();
	});
	var phi = f22.add(position, 'phi', -180, 180).name("経度").step(1);
	phi.onChange(function(value){
		position.phi = value;
		LightPosition();
	});
	f22.open();

	// トーラス結び目オプション（互いに素なpとqを入れる）
	var f23 = gui2.addFolder('TorusKnot / トーラス結び目オプション');
	var p = f23.add(Knot, 'p', 0, 33).name("p").step(1);
	p.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	var q = f23.add(Knot, 'q', 0, 33).name("q").step(1);
	q.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	var h = f23.add(Knot, 'height', 0.2, 10).name("高さ").step(0.2);
	h.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	f23.open();
	
	// 重複しないようにするための処理
	// 値はhtmlの構成によって書き換える
	if(FULLSCREEN){
		// dat.guiが既に存在していたら削除（フルスクリーン化時）
		var element = document.body;
		// alert(element.childNodes.length)
	 	if(element.childNodes.length == 18){	// ローカルだと6, ネットだと18？
	 		element.removeChild(element.childNodes[17]);
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiを消去
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
		var element = document.getElementById('RightDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// フルスクリーン時のdat.guiの位置調整
		gui1.domElement.style.position = 'absolute';
		gui1.domElement.style.right = '250px';
		gui1.domElement.style.top = '5px';
		gui1.domElement.style.height = '500px';
		document.body.appendChild(gui1.domElement);
		gui2.domElement.style.position = 'absolute';
		gui2.domElement.style.right = '0px';
		gui2.domElement.style.top = '5px';
		gui2.domElement.style.height = '500px';
		document.body.appendChild(gui2.domElement);
	}else{
		// dat.guiが既に存在していたら削除（ボタンクリック時）
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
		var element = document.getElementById('RightDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// 最大化時のdat.guiを消去
		var element = document.body;
	 	if(element.childNodes.length == 18){	// ローカルだと6, ネットだと18？
	 		element.removeChild(element.childNodes[17]);
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiの位置調整
		document.getElementById('LeftDat').appendChild(gui1.domElement);
		document.getElementById('RightDat').appendChild(gui2.domElement);
	};
}

//レンダリング
function render() {
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	stats.update();
	
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
	viewFPS();
	initCamera(70, 90, 60);
	initScene();
	originalLight();
	initObject();
	initDat();
	renderer.clear();
	render();
}

//-------------------------
//テクスチャ切り替えボタン
//-------------------------
/*
** 画像を読み込む関数
*/
function loadImage(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			imgURL = e.target.result;
			mesh.material.map = setTexture(imgURL);
			mesh.material.bumpMap = setTexture(imgURL);
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

function Button_Texture(value) {
	mesh.material.map = texture[value];
	mesh.material.bumpMap = texture[value]
}

//形状の変化
function Button_Shape(shape) {
	var geometry;
	if(shape == 'Torus'){
		geometry = new THREE.TorusGeometry(28, 10, 20, 40);
	}else if(shape == 'Cube'){
		geometry = new THREE.CubeGeometry(28, 28, 28);
	}else if(shape == 'Sphere'){
		geometry = new THREE.SphereGeometry(28, 40, 40);
	}else if(shape == 'Teapot'){
		geometry = new THREE.TeapotGeometry(24, 20, 1, 0, 1, 1, 1);
	}else if(shape == 'TorusKnot'){
		geometry = new THREE.TorusKnotGeometry(24, 3, 100, 100, Knot.p, Knot.q, Knot.height);
	}else if(shape == 'Plane'){
		geometry = new THREE.PlaneGeometry(28, 28);
	}
	scene.remove(mesh);
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
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
		case 37:	// left
		break;	

		case 38:	// up
		break;

		case 39:	// right
		break;

		case 40:	// down
		break;

		case "Z":
		changeScreen();
		break;

		case "S":
		Button_Startstop();
		break;
	};
};

//フォーカスを合わせる
window.addEventListener('load', function (){
	var element = document.getElementById("Button_Startstop"); 
	element.focus();
}, false);
