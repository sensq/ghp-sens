//=====================
// �K�v��js�t�@�C���̓ǂݍ���
document.write('<script type="text/javascript" src="../three58/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three58/three.js"></script>');
document.write('<script type="text/javascript" src="../three58/OBJLoader.js"></script>');
document.write('<script type="text/javascript" src="../three58/TrackballControls.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../util/dat.gui.min.js"></script>');
document.write('<script type="text/javascript" src="../util/TeapotGeometry.js"></script>');
//=====================

// �K�{�̃O���[�o���ϐ�
var DRAW_AREA;
var FULLSCREEN = false;	// false�ɂ���ƃu���E�U��ʑS�̂ɕ`��
var SHADOW = false;	// �V���h�[�}�b�s���O��ON/OFF
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

/*
** �I�u�W�F�N�g�̃v���p�e�B�̈ꗗ��\������֐�
** �f�o�b�O�p
*/
function printProperties(obj, opt) {
	var properties = new String();
	// ��2������0�������alert�ŕ\�������
	if(opt == 0){
		for (var prop in obj){
			if(obj[prop] == ''){
				obj[prop] = '����';
			}
			properties += prop + obj[prop];
		}
		if(properties == ''){
			properties = 'Property is none.';
		}
		alert(properties);
	}else{
		for (var prop in obj){
			if(obj[prop] == ''){
				obj[prop] = '<i>����</i>';
			}
		properties += "<font color='blue'><b>" + prop + "</b></font> =<br>" + obj[prop] + "<br><br>";
		}
		if(properties == ''){
			properties = 'Property is none.';
		}
		// �ʃy�[�W�ɕ\�������
		// �ꏊ�ɂ���Ă�FPS�\���̘g�Ȃǂ��\�������͎̂d�l
		var newWin = window.open(obj, obj, "width=400,height=600");
		newWin.document.open();
		newWin.document.write('<title>�v���p�e�B���X�g</title>');
		newWin.document.write(properties);
		newWin.document.close();
	}
};

/*
** ���`��̈�̐ݒ�ƃ����_���[�̍쐬
*/
function initThree(){
	// �`��̈�Ƃ���u���b�N�v�f���w��
	DRAW_AREA = document.getElementById('draw_area');
	if(FULLSCREEN){
		// CSS��ύX
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		DRAW_AREA.style.width = '100%';
		DRAW_AREA.style.position = 'absolute';
	};

	renderer = new THREE.WebGLRenderer({antialias: true});
	// �`��̈�̃T�C�Y���擾
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	DRAW_AREA.appendChild(renderer.domElement);
	renderer.setSize(Width, Height);
	// �f�t�H���g�̔w�i�F�ƃ��l
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	if(SHADOW == true){
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
	}else{
		renderer.shadowMapEnabled = false;
		renderer.shadowMapSoft = false;
	};
};

/*
** FPS�̕\��
*/
function viewFPS(){
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	if(FULLSCREEN){
		stats.domElement.style.top = '5px';
		stats.domElement.style.left = '5px';
	}else{
		stats.domElement.style.top = '11%';
		stats.domElement.style.left = '5.5%';
	};
	DRAW_AREA.appendChild(stats.domElement);
};

/*
** ���J�����̐ݒ�
*/
function initCamera() {
	// �������e�i��p, �A�X�y�N�g��, �\��������O�̌��E����, �\������鉜�̌��E�����j
	camera = new THREE.PerspectiveCamera(90, Width / Height, 1, 10000);
	// �J�����̈ʒu
	camera.position = new THREE.Vector3(0, 45, 25);
	// �J�����𓮂�����悤�ɂ���i2�ڂ̈����̓}�E�X���͂��󂯕t����div�v�f�j
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	// �e��I�v�V����
	controls.noRotate = false;	// ��]�֎~
	controls.noZoom = false;	// �Y�[���֎~
	controls.noPan = false;		// ���s�ړ��֎~
	controls.dynamicDampingFactor = 0.3;	// ��]���̑��x�̌�����
	controls.minDistance = 0;	// �Y�[���C���ő�l
	controls.maxDistance = Infinity;	// �Y�[���A�E�g�ő�l

	// �����Ă������
	controls.target = new THREE.Vector3(0, 0, 0)
};

/*
** ����ʏ�����
*/
function initScene() {
	scene = new THREE.Scene();
};

/*
** �������̐ݒ�
** �ꍇ�ɂ���Ď��s���낪�K�v
*/
function initLight() {
	// ���s����
	/* ���C�������ɔ������C�g���g���̂ŕK�v�Ȃ����A*/
	/* �V���h�[�}�b�s���O�͕��s���������Ή����ĂȂ��̂ō��ɂ��Ēu���Ƃ� */
	light = new THREE.DirectionalLight(0x888888);
	light.position = new THREE.Vector3(0, 0, 0);
	
	// �V���h�[�}�b�s���O���s���ꍇ
	if(SHADOW == true){
		light.target.position.copy(scene.position);
		// �����������i��Ɋm�F�p�j
		if(document.getElementsByName('light_vis')[0].checked)
			light.shadowCameraVisible = true;
		light.castShadow = true;
		// �����͈̔�
		light.shadowCameraLeft = -120;
		light.shadowCameraRight = 120;
		light.shadowCameraTop = -120;
		light.shadowCameraBottom = 120;
		light.shadowCameraNear = -200;
		light.shadowCameraFar = 600;
		light.shadowBias = -.001;
		// �e�̉𑜓x
		resolution = 2048;
		light.shadowMapWidth = light.shadowMapHeight = resolution;
		// �e�̔Z��
		light.shadowDarkness = .7;
	};
	scene.add(light);
	
	// �����i�ʒu���w�肷��K�v�͂Ȃ��j
	var amb = 0x333333;
	var ambient = new THREE.AmbientLight(amb);
	scene.add(ambient);

	// �������C�g�i���C���̌����j
	Hemilight = new THREE.HemisphereLight(0x666666, amb);
	Hemilight.position = new THREE.Vector3(0, 0, 0);
	scene.add(Hemilight);
};

/*
** �����e�N�X�`�����쐬���ĕԂ��֐�
*/
function setCtxTexture(str, color, size, fonttype, bgsize, transparent){
	// �����ȗ������ꍇ�̃f�t�H���g�l
	if(str === undefined | str === null){
		// ������
		var str = 'Test';
	};
	if(color === undefined | color === null){
		// �F
		var color = 0x000000;
	};
	if(size === undefined | size === null){
		// �����T�C�Y
		var size = 65;
	};
	if(fonttype === undefined | fonttype === null){
		// �t�H���g
		var fonttype = '�l�r �o�S�V�b�N';
	};
	if(bgsize === undefined | bgsize === null){
		// �w�i�̃T�C�Y
		var bgsize = 600;
	};
	if(transparent === undefined | transparent === null){
		// �w�i����
		var transparent = false;
	};

	// ���Ɠ��l��16�i���̌`�ŐF���w��ł���悤�ɂ��邽�߂̏���
	var rgb = new String();
	color = color.toString(16);
	color = ('0000' + color).slice(-6);
	rgb = '#' + color;

	// canvas�v�f���擾
	var font = new String();
	var canvas = document.createElement('canvas');
	// �摜�̉𑜓x�ɑ���
	canvas.width = 256; canvas.height = 256;
	var ctx = canvas.getContext('2d');
	// �w�i�F���[���I�ɍ쐬�i�T�C�Y�ƈʒu�͓K���ɒ�������j
	if(!transparent){
		ctx.fillStyle = 'white';
		ctx.font = bgsize + 'px' + ' ' + '�l�r �o�S�V�b�N';;
		ctx.textAlign = 'center';
		ctx.fillText('��', canvas.width/2, canvas.height + bgsize/4);
	};
	// �����쐬
	ctx.fillStyle = rgb;
	ctx.font = size + 'px' + ' ' + fonttype;;
	ctx.textAlign = 'center';
	ctx.fillText(str, canvas.width/2, canvas.height/2 + size/3);
	// �e�N�X�`�����쐬
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};

/*
** �e�N�X�`�����Z�b�g����֐�
** �f�t�H���g�̊֐��������Ėʓ|�Ȃ̂ō쐬
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

// �u�����_�[�ǂݍ���
function loadBlender(filename, scale, x, y, z, rx, ry, rz){
	// �����w�肵�Ȃ��ꍇ�̃f�t�H���g�l
	if(scale === undefined | scale === null){var scale = 1;}
	if(x === undefined | x === null){var x = 0;}
	if(y === undefined | y === null){var y = 0;}
	if(z === undefined | z === null){var z = 0;}
	if(rx === undefined | rx === null){var rx = 0;}
	if(ry === undefined | ry === null){var ry = 0;}
	if(rz === undefined | rz === null){var rz = 0;}

	var loader = new THREE.JSONLoader();
	var geometry;
	var materials = [];
	loader.load(filename, callback);
	function callback(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		meshBlender = new THREE.SkinnedMesh(geometry, material);
		meshBlender.scale = new THREE.Vector3(scale, scale, scale);
		meshBlender.position = new THREE.Vector3(x, y, z);
		meshBlender.rotation.x = rx * Math.PI/180;
		meshBlender.rotation.y = ry * Math.PI/180;
		meshBlender.rotation.z = rz * Math.PI/180;
		meshBlender.castShadow = true;
		meshBlender.receiveShadow = true;
		for(i=0; i<materials.length; i++){
			// ambient���S��0�ɂȂ�炵���̂ŃJ���[�̒l������
			materials[i].ambient = materials[i].color;
			materials[i].side = 2;
			// �A�j���[�V�������s����悤�ɂ���i��肭�����ĂȂ��̂ŕۗ��j
			// materials[i].morphTargets = true;
		};
		// �ǂ̃t���[����\�����邩���w��
		// meshBlender.morphTargetInfluences[0] = 1;
		scene.add(meshBlender);
	};
};

// obj�ǂݍ���
function loadSoccer(scale, x, y, z, rx, ry, rz){
	// �����w�肵�Ȃ��ꍇ�̃f�t�H���g�l
	if(scale === undefined | scale === null){var scale = 1;}
	if(x === undefined | x === null){var x = 0;}
	if(y === undefined | y === null){var y = 0;}
	if(z === undefined | z === null){var z = 0;}
	if(rx === undefined | rx === null){var rx = 0;}
	if(ry === undefined | ry === null){var ry = 0;}
	if(rz === undefined | rz === null){var rz = 0;}

	var loader = new THREE.OBJLoader();
	var geometry;
	loader.load('./s06.obj', function(geometry) {
		meshSoccer = geometry;
		//�T�b�J�[�{�[��
		var c = meshSoccer.children[0].geometry.faces;
		for(i=0; i<c.length; i++){
			if(i<40){
				c[i].materialIndex = 0;	//�Z�p�`
			}else{
				c[i].materialIndex = 1;	//�܊p�`
			}
		}
		meshSoccer.children[0].material = new THREE.MeshFaceMaterial([
			new THREE.MeshLambertMaterial({ color:0xdddddd, side:2 }),
			new THREE.MeshLambertMaterial({ color:0x000000, side:2 })
		]);
        meshSoccer.scale = new THREE.Vector3(scale, scale, scale);
		meshSoccer.position = new THREE.Vector3(x, y, z);
		meshSoccer.rotation.x = rx * Math.PI/180;
		meshSoccer.rotation.y = ry * Math.PI/180;
		meshSoccer.rotation.z = rz * Math.PI/180;
		// ����Ă邯�ǂȂ����e���o�Ȃ�
		meshSoccer.castShadow = true;
		meshSoccer.receiveShadow = true;
		scene.add(meshSoccer);
	});
};

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	var texture = [];
	texture[0] = setCtxTexture('Home', 0x00ffff);
	texture[1] = setCtxTexture('Twitter', 0xff00ff);
	texture[2] = setCtxTexture('Blog', 0xffff00);
	texture[3] = setCtxTexture('Works', 0x0000ff);
	texture[4] = setCtxTexture('Google', 0x00ff00);
	texture[5] = setCtxTexture('pixiv', 0xff0000);

	// �L���[�u�̊e�ʂ̐F��ݒ�
	var materials = [
		new THREE.MeshPhongMaterial({color:0xff0000}),
		new THREE.MeshPhongMaterial({color:0x00ff00}),
		new THREE.MeshPhongMaterial({color:0x0000ff}),
		new THREE.MeshPhongMaterial({color:0xffff00}),
		new THREE.MeshPhongMaterial({color:0xff00ff}),
		new THREE.MeshPhongMaterial({color:0x00ffff})
	];
	// �F�ȊO�̃p�����[�^���ꊇ���Đݒ�
	for(var i=0; i<6; i++){
		materials[i].side = 2;
		materials[i].map = texture[i];
		if(document.getElementsByName('Blending')[0].checked){
			materials[i].blending = THREE.NormalBlending;
			materials[i].transparent = true;
			materials[i].opacity = 0.8;
		};
	};
	var material = new THREE.MeshFaceMaterial(materials);
	var geometry = new THREE.CubeGeometry(15, 15, 15);
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position = new THREE.Vector3(0, 0, 0);
	scene.add(mesh);

	// ���}�b�s���O�p�摜�i�S�������傫���łȂ��ƃ_���j
	var imgs = [];
	imgs[0] = 'skybox/px.jpg';
	imgs[1] = 'skybox/nx.jpg';
	imgs[2] = 'skybox/py.jpg';
	imgs[3] = 'skybox/ny.jpg';
	imgs[4] = 'skybox/pz.jpg';
	imgs[5] = 'skybox/nz.jpg';

	// �X�t�B�A�쐬
	var geoEnv = new THREE.SphereGeometry(10, 32, 32);
	var matEnv = new THREE.MeshPhongMaterial({
		emissive: 0x000000, color:0xaaaaaa, specular:0, ambient: 0x333333,
		side: 2,
	});
	// �e�N�X�`��
	if(document.getElementsByName('onTexture')[0].checked){
		matEnv.map = setTexture('miku.jpg');
	};
	// ���}�b�s���O
	if(document.getElementsByName('onEnv')[0].checked){
		matEnv.envMap = THREE.ImageUtils.loadTextureCube(imgs, new THREE.CubeRefractionMapping());
		matEnv.reflectivity = 1.0;
		matEnv.refractionRatio = 0.6;
	};
	// �o���v�}�b�s���O
	if(document.getElementsByName('onBump')[0].checked){
		matEnv.bumpMap = setTexture('miku.jpg');
		matEnv.bumpScale = 0.1;
	};
	meshEnv = new THREE.Mesh(geoEnv, matEnv);
	meshEnv.castShadow = true;
	meshEnv.position = new THREE.Vector3(0, 25, 0);
	scene.add(meshEnv);

	// Teapot
	var geoTea = new THREE.TeapotGeometry(6, 20, 1, 0, 1, 1, 1);
	var matTea = new THREE.MeshPhongMaterial({
		emissive: 0x777777, color:0x333333, specular:0xee9900, ambient: 0x000000,
		shininess: 4,
		metal: true,
		side: 2,
	});
	matTea.map = setTexture('./backgrounddetailed6.jpg');
	matTea.envMap = THREE.ImageUtils.loadTextureCube(imgs, new THREE.CubeRefractionMapping());
	var meshTea = new THREE.Mesh(geoTea, matTea);
	meshTea.castShadow = true;
	meshTea.receiveShadow = true;
	meshTea.position = new THREE.Vector3(25, -3.5, -8);
	meshTea.rotation.y = Math.PI/4;
	scene.add(meshTea);

	// �u�����_�[�ǂݍ��݁��\��
	loadBlender('zatsu.js', 3, -32, -2.5, -10);
	loadBlender('zatsu.js', 3, -38, -2.5, -5, 0, 90, 0);
	
	// obj�ǂݍ��݁��\��
	loadSoccer(5, -20, -5, 30);

	// �X�J�C�{�b�N�X���쐬����֐�
	// �L���[�u���ƃe�N�X�`���Ɏg���摜�̏������ʓ|
	var skyboxSphere = (function () {
		var geoSky = new THREE.SphereGeometry(400, 18, 18);
		var matSky = new THREE.MeshPhongMaterial({
			color: 0x00aaff,
			ambient: 0xaaaaff,
			specular: 0x000000,
			shininess: 90,
			metal: true,
			side: 2
		});
		if(document.getElementsByName('onSky')[0].checked){
			matSky.map = setTexture('sphere.jpg');
			matSky.color.setHex(0xffffff);
			matSky.ambient.setHex(0xffffff);
			// ���}�b�s���O�ő�p�ł��邪�኱�d��
			// matSky.envMap = THREE.ImageUtils.loadTextureCube(imgs);
			// matSky.refractionRatio = 0;
		};
		meshSkySphere = new THREE.Mesh(geoSky, matSky);
		meshSkySphere.receiveShadow = true;
	})();
	// �L���[�u���ƘZ�ʗp�ӂ���΂����̂Ŕ�r�I�y
	var skyboxCube = (function () {
		if(document.getElementsByName('onSky')[0].checked){
			var imgs = [];
			imgs[0] = setTexture('skybox/px.jpg');
			imgs[1] = setTexture('skybox/nx.jpg');
			imgs[2] = setTexture('skybox/py.jpg');
			imgs[3] = setTexture('skybox/ny.jpg');
			imgs[4] = setTexture('skybox/pz.jpg');
			imgs[5] = setTexture('skybox/nz.jpg');
			var matsSky = [];
			for(var i=0; i<6; i++){
				matsSky[i] = new THREE.MeshPhongMaterial();
				matsSky[i].side = 2;
				matsSky[i].map = imgs[i];
			};
			var matSky = new THREE.MeshFaceMaterial(matsSky);
		}else{
			var matSky = new THREE.MeshPhongMaterial({
				color: 0x00aaff,
				ambient: 0xaaaaff,
				side: 2
			});
		};
		var geoSky = new THREE.CubeGeometry(600, 600, 600);
		meshSkyCube = new THREE.Mesh(geoSky, matSky);
		meshSkyCube.receiveShadow = true;
	})();
	if(document.getElementsByName('onSkyform')[0].checked){
		scene.add(meshSkyCube);
	}else{
		scene.add(meshSkySphere);
	};

	// �����쐬����֐�
	(function floor() {
		// �i�q�͗l�͉摜���g���Ċȗ���
		var textureFloor = setTexture('./gray.jpg');
		var geoFloor = new THREE.PlaneGeometry(100, 100);
		var matFloor = new THREE.MeshPhongMaterial({
			color: 0xaaaaff,
			ambient: 0x888888,
			specular: 0x888888,
			shininess: 90,
			metal: true,
			side: 2,
			map: textureFloor
		});
		meshFloor = new THREE.Mesh(geoFloor, matFloor);
		meshFloor.rotation.x = -(Math.PI/2.0);
		meshFloor.position = new THREE.Vector3(0, -10, 0);
		meshFloor.castShadow = true;
		meshFloor.receiveShadow = true;
		scene.add(meshFloor);
	})();
	if(document.getElementsByName('removeFloor')[0].checked){
		scene.remove(meshFloor);
	};
 	dat_gui();
};

/*
** dat.gui�̍쐬
*/
function dat_gui(){
	var gui = new dat.GUI();
	var f1 = gui.addFolder('�e��p�����[�^');
	f1.add(meshEnv.material, 'reflectivity' , -5.0, 5.0).step(0.05).name("���ˁE���܂̋���");
	f1.add(meshEnv.material, 'refractionRatio' , -5.0, 5.0).step(0.05).name("���ܗ�");
	f1.add(meshEnv.material, 'bumpScale' , -1.0, 1.0).step(0.05).name("�o���v�X�P�[��");
	f1.open();

	// �d�����Ȃ��悤�ɂ��邽�߂̏���
	// �l��html�̍\���ɂ���ď���������
	if(FULLSCREEN){
		// dat.gui�����ɑ��݂��Ă�����폜�i�t���X�N���[�������j
		var element = document.body;
	 	if(element.childNodes.length == 17){
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui������
		var element = document.getElementById('dat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �t���X�N���[������dat.gui�̈ʒu����
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.right = '0px';
		gui.domElement.style.top = '5px';
		gui.domElement.style.height = '140px';
		document.body.appendChild(gui.domElement);
	}else{
		// dat.gui�����ɑ��݂��Ă�����폜�i�{�^���N���b�N���j
		var element = document.getElementById('dat');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �ő剻����dat.gui������
		var element = document.body;
	 	if(element.childNodes.length == 17){
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui�̈ʒu����
		gui.domElement.style.position = 'relative';
		gui.domElement.style.height = '140px';
		document.getElementById('dat').appendChild(gui.domElement);
	};
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); // �}�E�X����p
	stats.update();

	// ��]�p�ϐ�
	var omega;	// �p���x[deg/frm]
	var radius;	// ���a

	// ������]
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		radius * Math.sin(omega * 0.5 * dt * Math.PI / 180),
		80,
		radius * Math.cos(omega * 0.5 * dt * Math.PI / 180)
		);
	light.position = Hemilight.position;

	// mesh��]
	omega = 2;
	mesh.rotation.x = omega * 0.5 * dt * Math.PI / 360;
	mesh.rotation.z = omega * 0.5 * dt * Math.PI / 180;
	
	// �ŏI�I�ȕ`��
	renderer.render(scene, camera);
};

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera();	// �J����������
	initScene();	// �V�[��������
	initLight();	// ���C�g������
	initObject();	// �I�u�W�F�N�g������
	renderer.clear();	// �����_���[������
	render();		// �����_�����O
};

//========================
// ��������̓{�^���ȂǂɊւ���L�q
//========================

/*
** �ꊇ���ăV�[������蒼���֐�
** �ėp���������Ċy�����ǎ኱�x��
*/
function updateScene() {
	if(document.getElementsByName('onShadow')[0].checked){
		SHADOW = true;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
	}else{
		SHADOW = false
		renderer.shadowMapEnabled = false;
		renderer.shadowMapSoft = false;
	};
	initScene();
	initLight();
	initObject();
};

/*
** �ʂɃC�x���g�����s����֐����W�߂��N���X
** �{�^���ނł̃C�x���g�͂ł��邾���������ŏ���
*/
var updateObject = (function (){
	// ������
	this.visibleLight = function(){
		if(document.getElementsByName('light_vis')[0].checked){
			light.shadowCameraVisible = true;
		}else{
			light.shadowCameraVisible = false;
		};
	};
	// �L���[�u����
	this.blend = function(){
		if(document.getElementsByName('Blending')[0].checked){
			for(var i=0; i<6; i++){
				mesh.material.materials[i].blending = THREE.NormalBlending;
				mesh.material.materials[i].transparent = true;
				mesh.material.materials[i].opacity = 0.8;
			};
		}else{
			for(var i=0; i<6; i++){
				mesh.material.materials[i].transparent = false;
			};
		};
	};
	// �L���[�u����
	this.removefloor = function(){
		if(document.getElementsByName('removeFloor')[0].checked){
			scene.remove(meshFloor);
		}else{
			scene.add(meshFloor);
		};
	};
	// �e�N�X�`��
	this.map = function (){
		if(document.getElementsByName('onTexture')[0].checked){
			meshEnv.material.map = setTexture('miku.jpg');
		}else{
			// �����̖��������e�N�X�`�� = ����F�̃e�N�X�`����ݒ�
			// null���ƂȂ����ʂ̃e�N�X�`�����ݒ肳���̂ő��
			meshEnv.material.map = setCtxTexture('');
		};
	};
	// ���}�b�s���O
	this.env = function (){
		// ��肭�����Ȃ������̂őË�
		updateScene();
	};
	// �o���v�}�b�s���O
	this.bump = function (){
		if(document.getElementsByName('onBump')[0].checked){
			meshEnv.material.bumpMap = setTexture('miku.jpg');
		}else{
			meshEnv.material.bumpMap = setCtxTexture('');
		};
	};
	// �X�J�C�{�b�N�X�`��
	this.skyform = function(){
		if(document.getElementsByName('onSkyform')[0].checked){
			scene.remove(meshSkySphere);
			scene.add(meshSkyCube);
		}else{
			scene.remove(meshSkyCube);
			scene.add(meshSkySphere);
		};
	};
	// �X�J�C�{�b�N�X�e�N�X�`��
	this.sky = function (){
		if(document.getElementsByName('onSky')[0].checked){
			if(document.getElementsByName('onSkyform')[0].checked){
				var imgs = [];
				imgs[0] = setTexture('skybox/px.jpg');
				imgs[1] = setTexture('skybox/nx.jpg');
				imgs[2] = setTexture('skybox/py.jpg');
				imgs[3] = setTexture('skybox/ny.jpg');
				imgs[4] = setTexture('skybox/pz.jpg');
				imgs[5] = setTexture('skybox/nz.jpg');
				var matsSky = [];
				for(var i=0; i<6; i++){
					matsSky[i] = new THREE.MeshPhongMaterial();
					matsSky[i].side = 2;
					matsSky[i].map = imgs[i];
				};
				meshSkyCube.material = new THREE.MeshFaceMaterial(matsSky);
			}else{
				meshSkySphere.material = new THREE.MeshPhongMaterial({
					map: setTexture('sphere.jpg'),
					side: 2
				});
			};
		}else{
			if(document.getElementsByName('onSkyform')[0].checked){
				meshSkyCube.material = new THREE.MeshPhongMaterial({
					color: 0x00aaff,
					ambient: 0xaaaaff,
					side: 2
				});
			}else{
				meshSkySphere.material = new THREE.MeshPhongMaterial({
					map: setCtxTexture(''),
					color: 0x00aaff,
					ambient: 0xaaaaff,
					side: 2
				});
			};
		};
	};
	return this;
})();

/*
** �`��̈���u���E�U�S�̂��ꕔ�݂̂��ɕύX����֐�
*/
function changeScreen(){
	// CSS��ύX���Ĉʒu����
	if(FULLSCREEN == false){
		FULLSCREEN = true;
		// body�S�̂��k�����Č����Ȃ�����
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		// stats�̈ʒu����
		stats.domElement.style.top = '5px';
		stats.domElement.style.left = '5px';
		// �`��̈��S�̂Ɋg��
		DRAW_AREA.style.width = '100%';
		DRAW_AREA.style.position = 'absolute';
	}else{
		FULLSCREEN = false;
		document.body.style.width = '98%';
		document.body.style.height = '98%';
		stats.domElement.style.top = '11%';
		stats.domElement.style.left = '5.5%';
		DRAW_AREA.style.width = '60%';
		DRAW_AREA.style.position = 'static';
	}
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// ���T�C�Y
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
	// dat.gui����蒼���i��蒼���Ȃ��Ɠ��삵�Ȃ��Ȃ�j
	dat_gui();
};

//======================
// ��������̓C�x���g�Ɋւ���L�q
//======================

/*
** �C�ӂ̗v�f�̃I�t�Z�b�g���擾����֐� �i�`��̈�̃I�t�Z�b�g�ʒu�擾�p�j
** �}�E�X���W�𐳂����擾���邽�߂ɕK�v
*/
function�@getElementPosition(element) {
        var top = left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
};

/*
** �}�E�X���W���擾���ďՓ˂����I�u�W�F�N�g��Ԃ��֐�
*/
var getIntersects = function(mouseX, mouseY){
	// �}�E�X���W����Ray���쐬
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	// Ray���Փ˂����I�u�W�F�N�g���擾
	var intersects = ray.intersectObjects(scene.children);
	return intersects;
};

/*
** �}�E�X�ړ����̃C�x���g
*/
document.addEventListener('mousemove', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// �Փ˂����I�u�W�F�N�g���擾
	var intersects = getIntersects(mouseX, mouseY);

	/* ��������C�x���g���� */

	meshSoccer.rotation.x = mouseX * Math.PI/180;
	meshSoccer.rotation.y = (mouseY + mouseX) / 2 * Math.PI/180;
	meshSoccer.rotation.z = mouseY * Math.PI/180;
	// mesh��Ŕ���
	for(var i=0; i<6; i++){
		if((intersects[0].faceIndex == i) && (intersects[0].object == mesh)){
			mesh.material.materials[i].emissive.setHex(0x666666);
		}else{
			mesh.material.materials[i].emissive.setHex(0);
		};
	};
	// mesh��ŃJ�[�\�����ς��
	if(intersects[0].object == mesh){
		DRAW_AREA.style.cursor = 'pointer';
	}else{
		DRAW_AREA.style.cursor = 'default';
	};
	// meshEnv��ŐF�ύX
	if(intersects[0].object == meshEnv){
		meshEnv.material.emissive.setHex(0x00ffff);
	}else{
		meshEnv.material.emissive.setHex(0);
	};
}, false);

/*
** �}�E�X�N���b�N���̃C�x���g�i���m�ɂ͗��������j�j
*/
document.addEventListener('click', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// �Փ˂����I�u�W�F�N�g���擾
	var intersects = getIntersects(mouseX, mouseY);

	/* ��������C�x���g���� */

	var url = ['http://www47.atpages.jp/sensq/home/', 
		'https://twitter.com/s_sensq', 
		'http://www47.atpages.jp/sensq/blog/', 
		'http://www47.atpages.jp/sensq/lab/top2.html', 
		'https://www.google.co.jp/', 
		'http://www.pixiv.net/',
	];

	for(var i=0; i<6; i++){
		if((intersects[0].faceIndex == i) && (intersects[0].object == mesh)){
			window.open(url[i], '_top');
		};
	};
}, false);

/*
** �L�[�{�[�h�������̃C�x���g
*/
document.onkeydown = function(e) { 
	var ctrl = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
	var shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;

	// ���������L�[�̃L�[�R�[�h���擾 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90�i0~9, a~z�j�̏ꍇ�͕����ɕϊ�
		keycode = String.fromCharCode(keycode).toUpperCase();
	};

	if(ctrl){	// ctrl�����Ȃ���̏ꍇ
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;
		};
	}else if(shift){	// shift�����Ȃ���̏ꍇ
		switch(keycode){
			case 37:	// left
			// �J������]��~
			cancelAnimationFrame(moveCamera);
			break;	

			case 38:	// up
			mesh.position.y += 1;
			break;

			case 39:	// right
			// �J������]
			(function mov(){
			moveCamera = requestAnimationFrame(mov);
			var omega = 0.5;
			var radius = 80;
			camera.position = new THREE.Vector3(
				radius * Math.sin(omega * 0.5 * moveCamera * Math.PI/180),
				50,
				radius * Math.cos(omega * 0.5 * moveCamera * Math.PI/180)
				);
			})();
			break;

			case 40:	// down
			mesh.position.y -= 1;
			break;
		};
	}else{
		switch(keycode){
			case 37:	// left
			meshBlender.rotation.y = -Math.PI/2;
			meshBlender.position.x -= 1;
			break;	

			case 38:	// up
			meshBlender.rotation.y = Math.PI;
			meshBlender.position.z -= 1;
			break;

			case 39:	// right
			meshBlender.rotation.y = Math.PI/2;
			meshBlender.position.x += 1;
			break;

			case 40:	// down
			meshBlender.rotation.y = 0;
			meshBlender.position.z += 1;
			break;

			case "Z":
			changeScreen();
			break;

			case "P":
			// �p�[�e�B�N����ǉ�
			var particle = (function(){
				var geoPar = new THREE.Geometry();
				var numParticles = 100;
				for(var i = 0 ; i < numParticles ; i++) {
				  geoPar.vertices.push(new THREE.Vector3(
				    Math.random() * 500 - 250,
				    Math.random() * 500 - 250,
				    Math.random() * 500 - 250));
				};
				// �}�e���A�����쐬
				var matPar = new THREE.ParticleBasicMaterial({
					size: 7,
					transparent: true,
					opacity: 0.7,
					map: setCtxTexture('��', 0xcccc00, 280, null, null, 1),
					blending: THREE.NormalBlending,
				});
				// �p�[�e�B�N�����쐬
				meshPar = new THREE.ParticleSystem(geoPar, matPar);
				meshPar.position = new THREE.Vector3(0, 0, 0);
				meshPar.sortParticles = false;
				scene.add(meshPar);
			})();
			break;
		};
	};
};

/*
** �E�B���h�E�̃��T�C�Y�ɑΉ�
*/
window.addEventListener('resize', function() {
	// ���T�C�Y���̕`��̈�̃T�C�Y�擾
	Width = DRAW_AREA.clientWidth;
	Height = DRAW_AREA.clientHeight;
	// ���T�C�Y���s
	renderer.setSize(Width, Height);
	camera.aspect = Width / Height;
	camera.updateProjectionMatrix();
}, false);

/*
** �e�L�X�g���Ȃǂ̃f�t�H���g�l���
*/
window.addEventListener('load', function() {
	document.getElementsByName('light_vis')[0].checked = true;
	document.getElementsByName('onTexture')[0].checked = true;
	document.getElementsByName('onBump')[0].checked = true;
	if(SHADOW == true)
		document.getElementsByName('onShadow')[0].checked = true;
	else
		document.getElementsByName('onShadow')[0].checked = false;
	document.getElementsByName('onEnv')[0].checked = true;
	document.getElementsByName('onSkyform')[0].checked = true;
	document.getElementsByName('onSky')[0].checked = true;
	document.getElementsByName('Blending')[0].checked = true;
	document.getElementsByName('removeFloor')[0].checked = false;
}, false);