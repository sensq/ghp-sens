var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = +new Date();
var pauseTime = 0, pause = 1;
var Side = 0;
var stats;
var img_flag = 1;

var img1 = './sea2.jpg';	//�e�N�X�`����URL
var img2 = './hue.png';
var img3 = './hue2.png';
var img4 = './miku.jpg';

texture1 = new THREE.ImageUtils.loadTexture(img1);
texture2 = new THREE.ImageUtils.loadTexture(img2);
texture3 = new THREE.ImageUtils.loadTexture(img3);
texture4 = new THREE.ImageUtils.loadTexture(img4);


//�`��̈�̐ݒ�
function initThree() {
	setInterval(function() {
		stats.begin();
		stats.end();
	}, 1000 / 60);
	Width = document.getElementById('canvas').clientWidth; //div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight; //div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPS�̕\��
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('canvas').appendChild(stats.domElement);
}

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(100, 20, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera,canvas);
}

//��ʏ�����
function initScene() {
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);
	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	geometry = new THREE.TorusGeometry(28, 10, 20, 40);
	material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		ambient: 0x888888,
		specular: 0xcccccc,
		emissive: 0x000000,
		shininess: 90,
		metal: true,
		map: texture1
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update(); //�}�E�X����p
    
	//��]�̒�~
	switch (pause) {
	case 0:
		document.getElementById("Button_Startstop").innerHTML = "START";
		break;
	case 1:
		document.getElementById("Button_Startstop").innerHTML = "STOP";
		mesh.rotation.y = 0.3 * (new Date() - baseTime + (Date.now() - pauseTime)) / 1000; //��]
		break;
	}
    
	//Culling�̐ݒ�
	switch (Side) {
	case 0:
		material.side = 0; //THREE.FrontSide
		document.getElementById("Button_Culling").innerHTML = "���ʂ�`��";
		break;
	case 1:
		material.side = 1; //THREE.BackSide;
		document.getElementById("Button_Culling").innerHTML = "�O���̂ݕ`��";
		break;
	case 2:
		material.side = 2; //THREE.DoubleSide;
		document.getElementById("Button_Culling").innerHTML = "�����̂ݕ`��";
		break;
	}
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initStats();
	initLight();
	initObject();
	renderer.clear();
	stats.update();
	render();
}

//-------------
//�{�^���̒ǉ�
//-------------
function Button_func() {
	initScene();
	initLight();
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

function Button_Culling() {
	switch (Side) {
	case 0:
		Side = 2;
		material.needsUpdate = true;
		Button_func();
		break;
	case 1:
		Side = 0;
		material.needsUpdate = true;
		Button_func();
		break;
	case 2:
		Side = 1;
		material.needsUpdate = true;
		Button_func();
		break;
	}
}

//�F�̕ω�
function Button_Color1() {
	material = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color2() {
	material = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color3() {
	material = new THREE.MeshPhongMaterial({
		color: 0x00ff00,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color4() {
	material = new THREE.MeshPhongMaterial({
		color: 0x0000ff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color5() {
	material = new THREE.MeshPhongMaterial({
		color: 0xffff00,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color6() {
	material = new THREE.MeshPhongMaterial({
		color: 0xff00ff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color7() {
	material = new THREE.MeshPhongMaterial({
		color: 0x0ff0ff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color8() {
	material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

function Button_Color9() {
	material = new THREE.MeshPhongMaterial({
		color: 0x000000,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	Button_func();
}

//�`��̕ω�
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

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

//�X�V���Ƀ{�^���̃`�F�b�N��߂�
window.addEventListener('load', function (){
	var checks=document.getElementsByName("Button_Startstop");
	for(var i=0;i<checks.length;i++){
		checks[i].checked=false;
	}
	
	var radios=document.getElementsByName("Button_Color");
	for(var i=0;i<radios.length;i++){
		radios[i].checked=false;
	}
	radios[7].checked=true;
	
	var radios=document.getElementsByName("Button_Shape");
	for(var i=0;i<radios.length;i++){
		radios[i].checked=false;
	}
	radios[0].checked=true;
	
	var radios=document.getElementsByName("Button_Texture");
	for(var i=0;i<radios.length;i++){
		radios[i].checked=false;
	}
	radios[0].checked=true;
	
	// �t�H�[�J�X�����킹�� 
	checks[0].focus();
	
}, false);
