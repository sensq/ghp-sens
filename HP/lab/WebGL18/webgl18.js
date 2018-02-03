//=====================
// �K�v��js�t�@�C���̓ǂݍ���
document.write('<script type="text/javascript" src="../three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three61/three.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../three61/TrackballControls.js"></script>');
//=====================

// �K�{�̃O���[�o���ϐ�
var DRAW_AREA;
var FULLSCREEN = false;	// false�ɂ���ƃu���E�U��ʑS�̂ɕ`��
var SHADOW = false;	// �V���h�[�}�b�s���O��ON/OFF
var stats;
var Width, Height;
var renderer, scene, light, camera, control;

var vFlag = false;
var videoURL;

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
	camera.position = new THREE.Vector3(100, 200, 100);
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
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	canvas = document.createElement('canvas');
	videoContext = canvas.getContext('2d');
	video = document.createElement('video');
	if(!vFlag){
		video.src = "../../lab2/movie/GN.mp4";
	}else{
		video.src = videoURL;
	}
	video.load();
	video.play();

	var playback = document.getElementById("playback");
	var time = document.getElementById("time");

	// �r�f�I�̃��^�f�[�^��ǂݍ��񂾂�A�X���C�_�[�𗘗p�\�ɂ���
	video.addEventListener("loadedmetadata", function() {
		playback.disabled = false;
		playback.min = playback.value = video.initialTime || 0;
		playback.max = video.duration;
	}, false);

	// �Đ����Ԃ��ω����邽�сA�X���C�_�[�̈ʒu���X�V
	video.addEventListener("timeupdate", function() {
		playback.value = video.currentTime;
		time.innerHTML = (video.currentTime).toFixed(0) + " / " + (video.duration).toFixed(0) + "[�b]";
	}, false);
	// �X���C�_�[�̒l���ω�������A����̍Đ��ʒu��ύX
	playback.addEventListener("change", function() {
		video.currentTime = this.valueAsNumber;
	}, false);

	video.addEventListener('loadeddata', function() {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		videoContext.fillStyle = '#000000';
		videoContext.fillRect( 0, 0, canvas.width, canvas.height );

		videoTexture = new THREE.Texture(canvas);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;

		// �e�N�X�`����\�镽�ʂ��쐬����֐�
		(function () {
			if(!document.getElementById("sphere").checked){
				var geo = new THREE.PlaneGeometry(canvas.width, canvas.height);
			}else{
				var geo = new THREE.SphereGeometry(canvas.width, 33,33);
			}
			var mat = new THREE.MeshPhongMaterial({
				color: 0xaaaaff,
				ambient: 0x888888,
				specular: 0x888888,
				shininess: 90,
				metal: true,
				side: 2,
				map: videoTexture,
				overdraw: true
			});
			mesh = new THREE.Mesh(geo, mat);
			mesh.rotation.x = -(Math.PI/2.0);
			mesh.rotation.z = (Math.PI/2.0);
			mesh.position = new THREE.Vector3(25, 0, 25);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add(mesh);
		})();
	}, false);

	var skyboxSphere = (function () {
		var geoSky = new THREE.SphereGeometry(5000, 30, 30);
		var matSky = new THREE.MeshPhongMaterial({
			color: 0x00aaff,
			ambient: 0xaaaaff,
			specular: 0x000000,
			shininess: 90,
			metal: true,
			side: 2
		});
		meshSkySphere = new THREE.Mesh(geoSky, matSky);
		meshSkySphere.receiveShadow = true;
	})();
	scene.add(meshSkySphere);
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

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}

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
** ���[�J�����瓮���ǂݍ��ފ֐�
** �N���X�h���C������ŏ�肭�����Ȃ��炵��
*/
function loadVideo(){
	if (document.getElementById('loadVideo').files[0].type.match('video.*')) {
		var video = document.getElementById('loadVideo').files[0];
		var info = "name:" + video.name + " size:" + video.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		fr.onload = onFileLoad;
		fr.readAsDataURL(video);
	}else{
		alert("����t�@�C�����w�肵�ĉ�����");
	}
}

function onFileLoad(e) {
	videoURL = e.target.result;
	vFlag = true;
	initScene();
	initLight();
	initObject();
}

/*
** �ꊇ���ăV�[������蒼���֐�
** �ėp���������Ċy�����ǎ኱�x��
*/
function updateScene() {
	video_control.stop();
	initScene();
	initLight();
	initObject();
};

/*
** �ʂɃC�x���g�����s����֐����W�߂��N���X
** �{�^���ނł̃C�x���g�͂ł��邾���������ŏ���
*/
var updateObject = (function (){
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
** ���搧��
*/
var video_control = (function (){
	// �Đ�/�ꎞ��~
	this.pause = function(){
		var button = document.getElementById("pause");
		if(video.paused){
			video.play();
			button.textContent = "�ꎞ��~";
		}else{
			video.pause();
			button.textContent = "�@�Đ��@";
		}
	}
	// ��~
	this.stop = function(){
		video.pause();
		video.currentTime = 0;
		var button = document.getElementById("pause");
		if(!video.paused){
			button.textContent = "�ꎞ��~";
		}else{
			button.textContent = "�@�Đ��@";
		}
	}
	// �~���[�g
	this.mute = function(){
		if(video.muted){
			video.muted = false;
		}else{
			video.muted = true;
		}
	}
	// �Đ����x�ύX
	this.rate = function(){
		var rate = document.getElementById("playRate").value;
		if(rate > 4.0){
			rate = 4.0;
		}else if(rate < 0.5){
			rate = 0.5;
		}
		video.playbackRate = rate;
	}
	// ������/���߂�
	this.skip = function (value) {
		onMouse = true;
		(function mov(){
			if(onMouse){
				requestAnimationFrame(mov);
			}
			video.currentTime += value;
		})();
	}
	return this;
})();

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

	// mesh��Ŕ���
	if(intersects[0].object == mesh){
		mesh.material.emissive.setHex(0x888888);
	}else{
		mesh.material.emissive.setHex(0);
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
			break;	

			case 38:	// up
			video_control.pause();
			break;

			case 39:	// right
			break;

			case 40:	// down
			video_control.stop();
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
	document.getElementById("sphere").checked = false;
	document.getElementById("playRate").value = (1.0).toFixed(1);
}, false);