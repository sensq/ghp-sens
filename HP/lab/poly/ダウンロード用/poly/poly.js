var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh,mesh2;
var dlight_flag = false;
var hlight_flag = false;
var baseTime = +new Date;
var pauseTimex = 0;
var pauseTimey = 0;
var pauseTimez = 0;
var pausex = 0;
var pausey = 0;
var pausez = 0;
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
	Hemilight.position = new THREE.Vector3(0, 0, 0);
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

//��]���x
var TempVelocity = function(){
	this.value = 0.2;
};

var Zoom = new TempZoom();
var Velocity = new TempVelocity();

function initDat(filename){
	mesh = new THREE.Object3D(); // �ǂݍ��݂���������܂ł̃_�~�[
	loader = new THREE.JSONLoader();
	function geo(geometry) {
		mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial);
		mesh.scale = new THREE.Vector3(1, 1, 1);
		mesh.position = new THREE.Vector3(0, 0, 0);
		mesh.rotation = new THREE.Vector3(0.1, 0.1, 0.1);
		
		if(filename=='./json/s05z.js'){ //s05z
			geometry.materials[0].ambient = new THREE.Color(0x444488); //�t���[���̐F
			geometry.materials[1].ambient = new THREE.Color(0xffffff); //���g�p
			geometry.materials[2].ambient = new THREE.Color(0x00ff00); //�t���[��1
			geometry.materials[3].ambient = new THREE.Color(0xff0000); //�t���[��2
			geometry.materials[4].ambient = new THREE.Color(0x0000ff); //�t���[��3
			geometry.materials[5].ambient = new THREE.Color(0xffffff); //���g�p
			geometry.materials[6].ambient = new THREE.Color(0x00ffff); //�O�p�`�̕����̐F
			geometry.materials[7].ambient = new THREE.Color(0x00ff00); //��1
			geometry.materials[8].ambient = new THREE.Color(0xff0000); //��2
			geometry.materials[9].ambient = new THREE.Color(0x0000ff); //��3
		}
		
		if(filename=='./json/s05w.js'){ //s05w
			geometry.materials[0].ambient = new THREE.Color(0x444488); //�t���[���̐F
		}

		for(i=0; i<=num; i++){
			geometry.materials[i].side = 2;
		}
		
		gui1 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
		
		var f11 = gui1.addFolder('�}�`�̉�]�Ȃ�');
		f11.add(mesh.rotation, 'x' , 0, 6.3).step(0.1).name("X");
		f11.add(mesh.rotation, 'y' , 0, 6.3).step(0.1).name("Y");
		f11.add(mesh.rotation, 'z' , 0, 6.3).step(0.1).name("Z");
		f11.add(Zoom, 'up').name("�g��");
		f11.add(Zoom, 'down').name("�k��");
		f11.add(Zoom, 'default').name("���ɖ߂�");
		f11.add(Velocity, 'value' , 0, 10).step(0.1).name("������]�̑��x")
		f11.add(controls, 'dynamicDampingFactor' , 0, 1).step(0.1).name('������');
		f11.open();
		
		gui1.domElement.style.position = 'absolute';
		//gui1.domElement.style.top = '120px';
		gui1.domElement.style.height = '300px';
		document.getElementById('inner-right2').appendChild(gui1.domElement);
		scene.add(mesh);
	}
	
	loader.load(filename, geo);
};

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	
	//--------
	// ��]�p
	//--------
	switch (pausex) {
	case 0:
		break;
	case 1:
		mesh.rotation.x = Velocity.value * (new Date() - baseTime + (Date.now() - pauseTimex)) / 1000; //��]
		break;
	}
	
	switch (pausey) {
	case 0:
		break;
	case 1:
		mesh.rotation.y = Velocity.value * (new Date() - baseTime + (Date.now() - pauseTimey)) / 1000; //��]
		break;
	}
	
	switch (pausez) {
	case 0:
		break;
	case 1:
		mesh.rotation.z = Velocity.value * (new Date() - baseTime + (Date.now() - pauseTimez)) / 1000; //��]
		break;
	}
	
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

//-----------------
// ��]�p�̃{�^��
//-----------------
function Button_Rotx() {
	switch (pausex) {
	case 0:
		pausex = 1;
		break;
	case 1:
		pausex = 0;
		pauseTimex = Date.now();
		break;
	}
};

function Button_Roty() {
	switch (pausey) {
	case 0:
		pausey = 1;
		break;
	case 1:
		pausey = 0;
		pauseTimey = Date.now();
		break;
	}
};

function Button_Rotz() {
	switch (pausez) {
	case 0:
		pausez = 1;
		break;
	case 1:
		pausez = 0;
		pauseTimez = Date.now();
		break;
	}
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

function Button_s05z() {
	num = 9;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s05z.js');
}

function Button_s05w() {
	num = 0;
	initScene();
	initLight();
	document.getElementById("inner-right2").innerHTML = ""
	initDat('./json/s05w.js');
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
	radios[8].checked=true;
}, false);
