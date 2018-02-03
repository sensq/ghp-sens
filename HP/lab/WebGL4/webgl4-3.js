var baseTime = +new Date;
var pauseTime = 0, pause = 1;
var Hex = 1.0/255;

var img = [];
img[0] = './sea2.jpg';	//�e�N�X�`����URL
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
//�����̐ݒ�
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

//�I�u�W�F�N�g�̐ݒ�
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
	//����
	gui1 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
	// �l���擾
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
	var f11 = gui1.addFolder('material / ���̂̐F');
	// Diffuse
	var color = f11.addColor(parameters, 'color').name("Diffuse / �g�U��").listen();
	color.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.color.setHex(value);
	});
	// Ambient
	var ambient = f11.addColor(parameters, 'ambient').name("Ambient / ����").listen();
	ambient.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.ambient.setHex(value);
	});
	// Specular
	var specular = f11.addColor(parameters, 'specular').name("Specular / ���ʌ�").listen();
	specular.onChange(function(value){
		value = value.replace("#", "0x");
		mesh.material.specular.setHex(value);
	});
	// Emissive
	var emissive = f11.addColor(parameters, 'emissive').name("Emissive / ���ˌ�").listen();
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
	var f12 = gui1.addFolder('Shininess / �n�C���C�g�̑傫��');
	var setShininess = f12.add(pShininess, 'shininess', 0, 100, 1);
	setShininess.onChange(function(value){
		if(!pShininess.HighLight)
			mesh.material.shininess = value;
	});
	var delHighLight = f12.add(pShininess, 'HighLight').name("�n�C���C�g������")
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
	var f13 = gui1.addFolder('Extra / ���̑�');
	f13.add(mesh.material, 'wireframe');
	var onBump = f13.add(Bump, 'onBump').name("�o���v�}�b�v")
	onBump.onChange(function(){
		if(Bump.onBump)
			mesh.material.bumpScale = 0.4;
		else
			mesh.material.bumpScale = 0;
	});
	var textureNumber = {
		n: 5
	}
	var changeTexture = f13.add(textureNumber, 'n', {�J���[�}�b�v1:1, �J���[�}�b�v2:2, �C:0, �n��:3, �~�N:4, ����:5}).name("�e�N�X�`���[")
	changeTexture.onChange(function(value){
		value = parseInt(value);
		mesh.material.map = texture[value];
		mesh.material.bumpMap = texture[value];
	});
	var geometryType = {
		type: "Teapot"
	}
	var changeTexture = f13.add(geometryType, 'type', {����:'Plane', �g�[���X:'Torus', ��:'Sphere', ������:'Cube', �e�B�[�|�b�g:'Teapot', �g�[���X���і�:'TorusKnot'}).name("�`��")
	changeTexture.onChange(function(value){
		Button_Shape(value);
	});
	f13.open();

	//�E��
	gui2 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
	var f21 = gui2.addFolder('Light / �����̐F');

	// �l���擾
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
	// �_����
	var poiLight = f21.addColor(parametersLight, 'light').name("�_����").listen();
	poiLight.onChange(function(value){
		value = value.replace("#", "0x");
		PointLight.color.setHex(value);
	});
	// ����
	var ambLight = f21.addColor(parametersLight, 'ambient').name("����").listen();
	ambLight.onChange(function(value){
		value = value.replace("#", "0x");
		AmbientLight.color.setHex(value);
	});
	// ��������
	var hemiLight = f21.addColor(parametersLight, 'hemi').name("�������C�g�i��j").listen();
	hemiLight.onChange(function(value){
		value = value.replace("#", "0x");
		HemiLight.color.setHex(value);
	});
	var hemiGLight = f21.addColor(parametersLight, 'hemiGround').name("�������C�g�i���j").listen();
	hemiGLight.onChange(function(value){
		value = value.replace("#", "0x");
		HemiLight.groundColor.setHex(value);
	});
	f21.open();

	// �ɍ��W�ɕϊ�
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
	var f22 = gui2.addFolder('Position / �����̈ʒu');
	var radius = f22.add(position, 'r', 1, 200).name("����").step(1);
	radius.onChange(function(value){
		position.r = value;
		LightPosition();
	});
	var theta = f22.add(position, 'theta', -180, 180).name("�ܓx").step(1);
	theta.onChange(function(value){
		position.theta = value;
		LightPosition();
	});
	var phi = f22.add(position, 'phi', -180, 180).name("�o�x").step(1);
	phi.onChange(function(value){
		position.phi = value;
		LightPosition();
	});
	f22.open();

	// �g�[���X���іڃI�v�V�����i�݂��ɑf��p��q������j
	var f23 = gui2.addFolder('TorusKnot / �g�[���X���іڃI�v�V����');
	var p = f23.add(Knot, 'p', 0, 33).name("p").step(1);
	p.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	var q = f23.add(Knot, 'q', 0, 33).name("q").step(1);
	q.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	var h = f23.add(Knot, 'height', 0.2, 10).name("����").step(0.2);
	h.onChange(function(value){
		Button_Shape('TorusKnot');
	});
	f23.open();
	
	// �d�����Ȃ��悤�ɂ��邽�߂̏���
	// �l��html�̍\���ɂ���ď���������
	if(FULLSCREEN){
		// dat.gui�����ɑ��݂��Ă�����폜�i�t���X�N���[�������j
		var element = document.body;
		// alert(element.childNodes.length)
	 	if(element.childNodes.length == 18){	// ���[�J������6, �l�b�g����18�H
	 		element.removeChild(element.childNodes[17]);
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui������
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
		var element = document.getElementById('RightDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �t���X�N���[������dat.gui�̈ʒu����
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
		// dat.gui�����ɑ��݂��Ă�����폜�i�{�^���N���b�N���j
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
		var element = document.getElementById('RightDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �ő剻����dat.gui������
		var element = document.body;
	 	if(element.childNodes.length == 18){	// ���[�J������6, �l�b�g����18�H
	 		element.removeChild(element.childNodes[17]);
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui�̈ʒu����
		document.getElementById('LeftDat').appendChild(gui1.domElement);
		document.getElementById('RightDat').appendChild(gui2.domElement);
	};
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	stats.update();
	
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
	
	renderer.render(scene, camera);
}

//���s����֐�
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
//�e�N�X�`���؂�ւ��{�^��
//-------------------------
/*
** �摜��ǂݍ��ފ֐�
*/
function loadImage(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			imgURL = e.target.result;
			mesh.material.map = setTexture(imgURL);
			mesh.material.bumpMap = setTexture(imgURL);
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

function Button_Texture(value) {
	mesh.material.map = texture[value];
	mesh.material.bumpMap = texture[value]
}

//�`��̕ω�
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

//��]STOP/START
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
** �L�[�{�[�h�������̃C�x���g
*/
document.onkeydown = function(e) { 
	// ���������L�[�̃L�[�R�[�h���擾 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90�i0~9, a~z�j�̏ꍇ�͕����ɕϊ�
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

//�t�H�[�J�X�����킹��
window.addEventListener('load', function (){
	var element = document.getElementById("Button_Startstop"); 
	element.focus();
}, false);
