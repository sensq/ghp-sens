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

//�����̐ݒ�
function initLight() {
	light = new THREE.PointLight(0xd5d5d5);
	light.position = new THREE.Vector3(50, 200, 200);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x999999, 0x666666);
	Hemilight.position = new THREE.Vector3(50, 200, 200);
	scene.add(Hemilight);

	ambient = new THREE.AmbientLight(0x202020);
	scene.add(ambient);
}

function addLight() {
	scene.add(light);
	scene.add(Hemilight);
	scene.add(ambient);
}

function recreateDat (){
	document.getElementById('LeftDat').innerHTML = "";
	document.getElementById('RightDat').innerHTML = "";
	initDat();
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	var geometry;
	var check = document.getElementsByName('Button_Shape');
	if(check[0].checked){
		geometry = new THREE.TorusGeometry(28, 10, 20, 40);
	}else if(check[1].checked){
		geometry = new THREE.SphereGeometry(28, 40, 40);
	}else if(check[2].checked){
		geometry = new THREE.CubeGeometry(28, 28, 28);
	}else if(check[3].checked){
		geometry = new THREE.TeapotGeometry(24, 20, 1, 0, 1, 1, 1);
	}else if(check[4].checked){
		geometry = new THREE.TorusKnotGeometry(24, 3, 80, 10, 3, 7);
	}
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
	for(var i=0; i<6; i++){
		if(document.getElementsByName('Button_Texture')[i].checked){
			mesh.material.map = texture[i]
			mesh.material.bumpMap = texture[i]
		}
	}
	scene.add(mesh);
}

function initDat(){
	//����
	gui1 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
	
	// Diffuse
	var pColor = {
		r: Math.round(255*mesh.material.color.r), 
		g: Math.round(255*mesh.material.color.g), 
		b: Math.round(255*mesh.material.color.b)
	};
	var f11 = gui1.addFolder('Diffuse / �g�U��');
	var setColorR = f11.add(pColor, 'r' , 0, 255, 1).name("Red");
	setColorR.onChange(function(value){
		mesh.material.color.r = value*Hex;
	});
	var setColorG = f11.add(pColor, 'g' , 0, 255, 1).name("Green");
	setColorG.onChange(function(value){
		mesh.material.color.g = value*Hex;
	});
	var setColorB = f11.add(pColor, 'b' , 0, 255, 1).name("Blue");
	setColorB.onChange(function(value){
		mesh.material.color.b = value*Hex;
	});
	f11.open();
	
	// Ambient
	var pAmbient = {
		r: Math.round(255*mesh.material.ambient.r), 
		g: Math.round(255*mesh.material.ambient.g), 
		b: Math.round(255*mesh.material.ambient.b)
	};
	var f12 = gui1.addFolder('Ambient / ����');
	var setAmbientR = f12.add(pAmbient, 'r' , 0, 255, 1).name("Red");
	setAmbientR.onChange(function(value){
		mesh.material.ambient.r = value*Hex;
	});
	var setAmbientG = f12.add(pAmbient, 'g' , 0, 255, 1).name("Green");
	setAmbientG.onChange(function(value){
		mesh.material.ambient.g = value*Hex;
	});
	var setAmbientB = f12.add(pAmbient, 'b' , 0, 255, 1).name("Blue");
	setAmbientB.onChange(function(value){
		mesh.material.ambient.b = value*Hex;
	});
	f12.open();
	
	// Shininess
	var pShininess = {
		shininess: mesh.material.shininess,
		HighLight: HighLight = false
	};
	var f13 = gui1.addFolder('Shininess / �n�C���C�g�̑傫��');
	var setShininess = f13.add(pShininess, 'shininess', 0, 100, 1);
	setShininess.onChange(function(value){
		if(!pShininess.HighLight)
			mesh.material.shininess = value;
	});
	var delHighLight = f13.add(pShininess, 'HighLight').name("�n�C���C�g������")
	delHighLight.onChange(function(){
		if(pShininess.HighLight)
			mesh.material.shininess = 10000000;
		else
			mesh.material.shininess = pShininess.shininess;
	});
	f13.open();
	
	//�E��
	gui2 = new dat.GUI(); // dat.GUI �N���X�̃I�u�W�F�N�g��錾
	
	// Specular
	var pSpecular = {
		r: Math.round(255*mesh.material.specular.r), 
		g: Math.round(255*mesh.material.specular.g), 
		b: Math.round(255*mesh.material.specular.b)
	};
	var f21 = gui2.addFolder('Specular / ���ʌ�');
	var setSpecularR = f21.add(pSpecular, 'r' , 0, 255, 1).name("Red");
	setSpecularR.onChange(function(value){
		mesh.material.specular.r = value*Hex;
	});
	var setSpecularG = f21.add(pSpecular, 'g' , 0, 255, 1).name("Green");
	setSpecularG.onChange(function(value){
		mesh.material.specular.g = value*Hex;
	});
	var setSpecularB = f21.add(pSpecular, 'b' , 0, 255, 1).name("Blue");
	setSpecularB.onChange(function(value){
		mesh.material.specular.b = value*Hex;
	});
	f21.open();
	
	// Emissive
	var pEmissive = {
		r: Math.round(255*mesh.material.emissive.r), 
		g: Math.round(255*mesh.material.emissive.g), 
		b: Math.round(255*mesh.material.emissive.b)
	};
	var f22 = gui2.addFolder('Emissive / ���ˌ�');
	var setEmissiveR = f22.add(pEmissive, 'r' , 0, 255, 1).name("Red");
	setEmissiveR.onChange(function(value){
		mesh.material.emissive.r = value*Hex;
	});
	var setEmissiveG = f22.add(pEmissive, 'g' , 0, 255, 1).name("Green");
	setEmissiveG.onChange(function(value){
		mesh.material.emissive.g = value*Hex;
	});
	var setEmissiveB = f22.add(pEmissive, 'b' , 0, 255, 1).name("Blue");
	setEmissiveB.onChange(function(value){
		mesh.material.emissive.b = value*Hex;
	});
	f22.open();
	
	// Extra
	var Bump = {
		onBump: onBump = true
	};
	var f23 = gui2.addFolder('Extra / ���̑�');
	f23.add(mesh.material, 'wireframe');
	var onBump = f23.add(Bump, 'onBump').name("�o���v�}�b�v")
	onBump.onChange(function(){
		if(Bump.onBump)
			mesh.material.bumpScale = 0.4;
		else
			mesh.material.bumpScale = 0;
	});
	var textureNumber = {
		n: 5
	}
	var changeTexture = f23.add(textureNumber, 'n', {�J���[�}�b�v1:1, �J���[�}�b�v2:2, �C:0, �n��:3, �~�N:4, ����:5}).name("�e�N�X�`���[")
	changeTexture.onChange(function(value){
		value = parseInt(value);
		mesh.material.map = texture[value];
		mesh.material.bumpMap = texture[value];
	});
	var geometryType = {
		type: "Teapot"
	}
	var changeTexture = f23.add(geometryType, 'type', {�g�[���X:'Torus', ��:'Sphere', ������:'Cube', �e�B�[�|�b�g:'Teapot', �g�[���X���і�:'TorusKnot'}).name("�`��")
	changeTexture.onChange(function(value){
		Button_Shape(value);
	});
	f23.open();

	// �d�����Ȃ��悤�ɂ��邽�߂̏���
	// �l��html�̍\���ɂ���ď���������
	if(FULLSCREEN){
		// dat.gui�����ɑ��݂��Ă�����폜�i�t���X�N���[�������j
		var element = document.body;
		// alert(element.childNodes.length)
	 	if(element.childNodes.length == 6){	// ���[�J������5, �l�b�g����17�H
	 		element.removeChild(element.childNodes[5]);
	 		element.removeChild(element.childNodes[4]);
	 	};
		// �ʏ펞��dat.gui������
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �t���X�N���[������dat.gui�̈ʒu����
		gui1.domElement.style.position = 'absolute';
		gui1.domElement.style.right = '250px';
		gui1.domElement.style.top = '5px';
		gui1.domElement.style.height = '350px';
		document.body.appendChild(gui1.domElement);
		gui2.domElement.style.position = 'absolute';
		gui2.domElement.style.right = '0px';
		gui2.domElement.style.top = '5px';
		gui2.domElement.style.height = '400px';
		document.body.appendChild(gui2.domElement);
	}else{
		// dat.gui�����ɑ��݂��Ă�����폜�i�{�^���N���b�N���j
		var element = document.getElementById('LeftDat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �ő剻����dat.gui������
		var element = document.body;
	 	if(element.childNodes.length == 6){	// ���[�J������5, �l�b�g����17�H
	 		element.removeChild(element.childNodes[5]);
	 		element.removeChild(element.childNodes[4]);
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
	initLight();
	initObject();
	initDat();
	renderer.clear();
	render();
}

//-------------------------
//�e�N�X�`���؂�ւ��{�^��
//-------------------------
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
		geometry = new THREE.TorusKnotGeometry(24, 3, 80, 10, 3, 7);
	}

	scene.remove(mesh);
	mesh = new THREE.Mesh(geometry, material);
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
