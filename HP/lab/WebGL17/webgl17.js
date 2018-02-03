//=====================
// �K�v��js�t�@�C���̓ǂݍ���
document.write('<script type="text/javascript" src="../three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three61/three.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../util/dat.gui.min.js"></script>');
document.write('<script type="text/javascript" src="../util/TeapotGeometry.js"></script>');
document.write('<script type="text/javascript" src="../three61/OBJLoader.js"></script>');
document.write('<script type="text/javascript" src="../three61/TrackballControls.js"></script>');
//=====================

// �K�{�̃O���[�o���ϐ�
var DRAW_AREA;
var FULLSCREEN = false;	// false�ɂ���ƃu���E�U��ʑS�̂ɕ`��
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

var imgFlag = false;

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
	renderer.setClearColorHex(0x333333, 1.0);
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
	camera.position = new THREE.Vector3(0, 45, 300);
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
** �e�N�X�`�����Z�b�g����֐�
** �f�t�H���g�̊֐��������Ėʓ|�Ȃ̂ō쐬
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

function particle(numParticles, radius){
	// �摜�ǂݍ��݌�͌`���ς��Ă����̉摜���g��
	if(imgFlag){
		texture = setTexture(imgURL);
	}else{
		texture = setTexture('./miku.png');
	}

	// �p�[�e�B�N���̃}�e���A�����쐬
	var material = new THREE.ParticleBasicMaterial({
		size: 10,
		transparent: true,
		opacity: 0.7,
		map: texture,
		color: 0xffffff,
		blending: THREE.NormalBlending,
		depthTest: false,
	});

	// ���q���̐F��ς���
	if(document.getElementById('Rcolor').checked){
		material.vertexColors = true;
	}else{
		material.vertexColors = false;
	}

	geometry = new THREE.Geometry();

	// ������
	if(document.getElementById('cube').checked){
		for(var i = 0 ; i < numParticles ; i++) {
			var area = new THREE.Vector3(
				Math.sqrt(2) * radius * (Math.random() - 0.5),
				Math.sqrt(2) * radius * (Math.random() - 0.5),
				Math.sqrt(2) * radius * (Math.random() - 0.5)
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// �s�ψ�ȉ~
	}else if(document.getElementById('circle_bad').checked){
		var x, y;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.cos(ph);
			y = r * Math.sin(ph);
			var area = new THREE.Vector3(
				x, y, 0
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// �ψ�ȉ~
	}else if(document.getElementById('circle_good').checked){
		var x, y;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.sqrt(Math.random());
			ph = 2 * Math.PI * Math.random();

			x = r * Math.cos(ph);
			y = r * Math.sin(ph);
			var area = new THREE.Vector3(
				x, y, 0
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// ���̕\�ʂɕs�ψ�ɕ��z
	}else if(document.getElementById('surf_bad').checked){
		var x, y, z;
		var r, th, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius;
			th = 2 * Math.PI * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.sin(th) * Math.cos(ph);
			y = r * Math.sin(th) * Math.sin(ph);
			z = r * Math.cos(th);
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// ���̕\�ʂɋψ�ɕ��z
	}else if(document.getElementById('surf_good').checked){
		var x, y, z;
		var r, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = 2 * (Math.random() - 0.5);
			ph = 2 * Math.PI * Math.random();

			x = radius * Math.sqrt(1 - Math.pow(r, 2)) * Math.cos(ph);
			y = radius * Math.sqrt(1 - Math.pow(r, 2)) * Math.sin(ph);
			z = radius * r;
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// �s�ψ�ȋ�
	}else if(document.getElementById('sphere_bad').checked){
		var x, y, z;
		var r, th, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r = radius * Math.random();
			th = 2 * Math.PI * Math.random();
			ph = 2 * Math.PI * Math.random();

			x = r * Math.sin(th) * Math.cos(ph);
			y = r * Math.sin(th) * Math.sin(ph);
			z = r * Math.cos(th);
			var area = new THREE.Vector3(
				x, y, z
			);
			geometry.vertices.push(area);
			if(document.getElementById('Rcolor').checked){
				var color = new THREE.Color(0xffffff);
				color.setRGB(Math.random(), Math.random(), Math.random());
				geometry.colors.push(color);
			}
		};
	// �ψ�ȋ�
	}else if(document.getElementById('sphere_good').checked){
		var x, y, z;
		var r1, r2, ph;
		for(var i = 0 ; i < numParticles ; i++) {
			r1 = 2 * (Math.random() - 0.5);
			r2 = Math.random();
			ph = 2 * Math.PI * Math.random();

			x = radius * Math.pow(r2, 1.0/3.0) * Math.sqrt(1 - Math.pow(r1, 2)) * Math.cos(ph);
			y = radius * Math.pow(r2, 1.0/3.0) * Math.sqrt(1 - Math.pow(r1, 2)) * Math.sin(ph);
			z = radius * Math.pow(r2, 1.0/3.0) * r1;
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	// ���T�[�W���Ȑ�
	}else if(document.getElementById('Lissajous').checked){
		var x, y, z;
		var fr1 = parseFloat(document.getElementById('fr1').value);
		var fr2 = parseFloat(document.getElementById('fr2').value);
		var fr3 = parseFloat(document.getElementById('fr3').value);
		var ph1 = parseFloat(document.getElementById('ph1').value);
		var ph2 = parseFloat(document.getElementById('ph2').value);
		var ph3 = parseFloat(document.getElementById('ph3').value);
		for(var i = 0 ; i < numParticles ; i++) {
			x = radius * Math.sin(fr1 * i + ph1);
			y = radius * Math.sin(fr2 * i + ph2);
			z = radius * Math.sin(fr3 * i + ph3);
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	// ���ʃ��T�[�W��
	}else if(document.getElementById('3DLissajous').checked){
		var x, y, z;
		var u, v;
		var p = parseFloat(document.getElementById('fr_p').value);
		var q = parseFloat(document.getElementById('fr_q').value);
		var r = parseFloat(document.getElementById('fr_r').value);
		for(var i = 0 ; i < numParticles ; i++) {
			u = (q/p) * i;
			v = r * i;
			x = radius * Math.cos(u) * Math.sin(v);
			y = radius * Math.sin(u) * Math.sin(v);
			z = radius * Math.cos(v);
			var area = new THREE.Vector3(
				x, y, z
			);
			var color = new THREE.Color(0xffffff);
			color.setRGB(Math.random(), Math.random(), Math.random());
			geometry.vertices.push(area);
			geometry.colors.push(color);
		};
	}

	// �p�[�e�B�N�����쐬
	mesh = new THREE.ParticleSystem(geometry, material);
	mesh.position = new THREE.Vector3(0, 0, 0);
	mesh.sortParticles = false;
	scene.add(mesh);
}

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	particle(2000, 200);
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); // �}�E�X����p
	stats.update();

	// ����
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		radius * Math.sin(omega * 0.5 * Math.PI / 180),
		80,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;
	
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
** �摜��ǂݍ��ފ֐�
*/
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			mesh.material.map = setTexture(e.target.result);
			imgURL = e.target.result;
			imgFlag = true;
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

/*
** �ꊇ���ăV�[������蒼���֐�
** �ėp���������Ċy�����ǎ኱�x��
*/
function updateScene() {
	initScene();
	initLight();
	initObject();
};

/*
** �ʂɃC�x���g�����s����֐����W�߂��N���X
** �{�^���ނł̃C�x���g�͂ł��邾���������ŏ���
*/
var updateObject = (function (){
	// �p�[�e�B�N���̕ω�
	this.Particles = function(){
		var numParticles = document.getElementById('numParticles').value;
		var radius = document.getElementById('radius').value;
		var size = document.getElementById('size').value;
		scene.remove(mesh)
		particle(numParticles, radius);
		mesh.material.size = size;
	};
	// �p�[�e�B�N���S�̂���]
	this.rotate = function(){
		if(document.getElementById('rotate').checked){
			(function mov(){
				rotMesh = requestAnimationFrame(mov);
				var omega = 1.0;
				mesh.rotation.y = omega * 0.5 * rotMesh * Math.PI / 360;
				mesh.rotation.z = omega * 0.5 * rotMesh * Math.PI / 180;
			})();
		}else{
			cancelAnimationFrame(rotMesh);
		}
	}
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
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;
		};
	}else{
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
	document.getElementById('numParticles').value = 2000;
	document.getElementById('radius').value = 200;
	document.getElementById('size').value = 10;
	document.getElementById('rotate').checked = true;
	
	// ���T�[�W���Ȑ��p�����[�^
	document.getElementById('fr1').value = 5;
	document.getElementById('fr2').value = 6;
	document.getElementById('fr3').value = 0;
	document.getElementById('ph1').value = Math.PI/2;
	document.getElementById('ph2').value = Math.PI/2;
	document.getElementById('ph3').value = 0;

	// ���ʃ��T�[�W���Ȑ��p�����[�^
	document.getElementById('fr_p').value = 4;
	document.getElementById('fr_q').value = 5;
	document.getElementById('fr_r').value = 1;
	updateObject.rotate();
}, false);