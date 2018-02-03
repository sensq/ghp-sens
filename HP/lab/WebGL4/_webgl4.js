var renderer;
var camera, controls;
var scene;
var light, ambient;
var material, mesh;
var baseTime = +new Date;
var pauseTime = 0, pause = 1;
var stats;
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

/*
** �I�u�W�F�N�g�̃v���p�e�B�̈ꗗ��\������֐�
** �f�o�b�O�p
*/
function printProperties(obj, opt) {
	this.obj = obj;
	this.opt = opt || 0;
	this.properties = new String();
	// ��2������1�������alert�ŕ\�������
	if(this.opt == 1){
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '����';
			}
			this.properties += this.prop + "\n" + this.obj[this.prop] + "\n" + "\n";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		alert(this.properties);
	}else{
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '<i>����</i>';
			}
		this.properties += "<font color='blue'><b>" + this.prop + "</b></font> =<br>" + this.obj[this.prop] + "<br><br>";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		// �ʃy�[�W�ɕ\�������
		// �ꏊ�ɂ���Ă�FPS�\���̘g�Ȃǂ��\�������͎̂d�l
		this.newWin = window.open(this.obj, this.obj, "width=400,height=600");
		this.newWin.document.open();
		this.newWin.document.write('<title>�v���p�e�B���X�g</title>');
		this.newWin.document.write(this.properties);
		this.newWin.document.close();
	}
};

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('draw_area').clientWidth;	//div�v�f�̃T�C�Y���擾
	Height = document.getElementById('draw_area').clientHeight;	//div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('draw_area').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPS�̕\��
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';	//�ォ��̈ʒu
	document.getElementById('draw_area').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(70, 90, 60);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , draw_area);
	
	function Track() {
		requestAnimationFrame(Track);
		controls.update();	//�}�E�X����p
	};
	Track();
}

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.PointLight(0xd5d5d5);
	light.position = new THREE.Vector3(0, 50, 50);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(0, 10, 10);
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
	});
	MS = new MaterialSample();
	
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	for(var i=0; i<6; i++){
		if(document.getElementsByName('Button_Texture')[i].checked){
			mesh.material.map = texture[i]
		}
	}
	scene.add(mesh);

	var meshFloor = new myObj.segmentPlane(10, 10);
	scene.add(meshFloor.mesh)
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
	
	var f23 = gui2.addFolder('Extra');
	f23.add(mesh.material, 'wireframe');
	f23.open();
	
	document.getElementById('LeftDat').appendChild(gui1.domElement);
	document.getElementById('RightDat').appendChild(gui2.domElement);
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	
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
//�e�N�X�`���؂�ւ��{�^��
//-------------------------
function Button_Texture(value) {
	mesh.material.map = texture[value];
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
	initScene();
	addLight();
	document.getElementById('LeftDat').innerHTML = "";
	document.getElementById('RightDat').innerHTML = "";
	initDat();

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	renderer.clear();
	render();
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

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('draw_area').clientWidth;
	newHeight = document.getElementById('draw_area').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//�t�H�[�J�X�����킹��
window.addEventListener('load', function (){
	var element = document.getElementById("Button_Startstop"); 
	element.focus();
}, false);
