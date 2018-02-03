var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh,mesh2;
var dlight_flag = false;
var hlight_flag = false;
var num = 3;

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth;
	Height = document.getElementById('canvas').clientHeight;
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPS�̕\��
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '10px';	//�ォ��̈ʒu
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(4, 0, 0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	
	function Track() {
		requestAnimationFrame(Track);
		controls.update();	//�}�E�X����p
	};
	Track();
};

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
};

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(0, 100, 0);
	scene.add(Hemilight);

	ambient = new THREE.AmbientLight(0xdddddd);
	scene.add(ambient);
};

//�g��k���p
var TempZoom = function(){
	this.up = function(){
		mesh.scale.x += 0.1;
		mesh.scale.y += 0.1;
		mesh.scale.z += 0.1;
	}
	this.down = function(){
		mesh.scale.x -= 0.1;
		mesh.scale.y -= 0.1;
		mesh.scale.z -= 0.1;
	}
	this.default = function(){
		mesh.scale.x = 1;
		mesh.scale.y = 1;
		mesh.scale.z = 1;
	}
};

var Zoom = new TempZoom();

function initDat(filename){
	mesh = new THREE.Object3D(); // �ǂݍ��݂���������܂ł̃_�~�[
	loader = new THREE.JSONLoader();
	function geo(geometry) {
		mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial);
		mesh.scale = new THREE.Vector3(1, 1, 1);
		mesh.position = new THREE.Vector3(0, 0, 0);

		for(i=0; i<=num; i++){
			geometry.materials[i].side = 2;
		}
		
		gui1 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
		
		var f11 = gui1.addFolder('�}�`�̊g��k��');
		f11.add(Zoom, 'up').name("�g��");
		f11.add(Zoom, 'down').name("�k��");
		f11.add(Zoom, 'default').name("���ɖ߂�");
		f11.open();
		var f12 = gui1.addFolder('�J������DampingFactor');
		f12.add(controls, 'dynamicDampingFactor' , 0, 1).step(0.1).name('������');
		f12.open();
		
		gui1.domElement.style.position = 'absolute';
		gui1.domElement.style.height = '300px';
		document.getElementById('inner-right2').appendChild(gui1.domElement);
		scene.add(mesh);
	}
	
	loader.load(filename, geo);
};

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	
	switch (dlight_flag) {
	case false:
		light.position.x = 0;
		light.position.y = 0;
		light.position.z = 0;
		break;
	case true:
		light.position.x = 3;
		light.position.y = 3;
		light.position.z = 1;
		break;
	}
	
	switch (hlight_flag) {
	case false:
		Hemilight.position.x = 0;
		Hemilight.position.y = 0;
		Hemilight.position.z = 0;
		break;
	case true:
		Hemilight.position.x = 3;
		Hemilight.position.y = 3;
		Hemilight.position.z = 1;
		break;
	}
	
	renderer.render(scene, camera);
};

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initStats();
	initLight();
	initDat('./json/s05.js');
	renderer.clear();
	render();
};

//--------------------
// ���C�g�̋[��ON/OFF
//--------------------
function Button_dLight() {
	switch (dlight_flag) {
	case false:
		dlight_flag = true;
		break;
	case true:
		dlight_flag = false;
		break;
	}
};

function Button_hLight() {
	switch (hlight_flag) {
	case false:
		hlight_flag = true;
		break;
	case true:
		hlight_flag = false;
		break;
	}
};

//-----------------
// �I�u�W�F�N�g�ύX
//-----------------
function Button_s05() {
	num = 3;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s05.js');
};

function Button_r02() {
	num = 3;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/r02.js');
};

function Button_r03() {
	num = 2;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/r03.js');
};

function Button_s01() {
	num = 1;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s01.js');
};

function Button_s03() {
	num = 4;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s03.js');
};

function Button_s04() {
	num = 4;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s04.js');
};

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//�X�V���Ƀ`�F�b�N�{�b�N�X�̃`�F�b�N���O��
window.addEventListener('load', function (){
	var checks=document.getElementsByName("checkb");
	for(var i=0;i<checks.length;i++){
		checks[i].checked=false;
	}
	var radios=document.getElementsByName("Button_Shape");
	for(var i=0;i<radios.length;i++){
		radios[i].checked=false;
	}
	radios[5].checked=true;
}, false);
