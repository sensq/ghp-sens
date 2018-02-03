//=====================
// �K�v��js�t�@�C���̓ǂݍ���
document.write('<script type="text/javascript" src="../three61/three.js"></script>');
document.write('<script type="text/javascript" src="../three61/Detector.js"></script>');
document.write('<script type="text/javascript" src="../three61/TrackballControls.js"></script>');
document.write('<script type="text/javascript" src="../util/stats.min.js"></script>');
document.write('<script type="text/javascript" src="../util/dat.gui.min.js"></script>');
document.write('<script type="text/javascript" src="../util/Tween.js"></script>');
document.write('<script type="text/javascript" src="../util/THREEx.KeyboardState.js"></script>');
document.write('<script type="text/javascript" src="./myObject.js"></script>');
//=====================

// �K�{�̃O���[�o���ϐ�
var DRAW_AREA;
var FULLSCREEN = false;	// false�ɂ���ƃu���E�U��ʑS�̂ɕ`��
var SWITCH_SHADOW = false;	// �V���h�[�}�b�s���O��ON/OFF
var SHADOW = false;	// SWITCH_SHADOW��؂�ւ����Ƃ��ɕς��t���O
var VISIBLE_LIGHT = true;	// �V���h�[�}�b�s���OON��Ԃ�true���ƌ�������
var stats;
var Width, Height;
var renderer, keyboard, scene, light, camera, control;

//==================
// ��������͂قڕK�{�̊֐�
//==================

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

/*
** ���`��̈�̐ݒ�ƃ����_���[�̍쐬
*/
function initThree(){
	// �L�[�{�[�h�p�I�u�W�F�N�g�쐬
	keyboard = new THREEx.KeyboardState();
	// �`��̈�Ƃ���u���b�N�v�f���w��
	this.DRAW_AREA = document.getElementById('draw_area');
	if(FULLSCREEN){
		// CSS��ύX
		document.body.style.width = '100%';
		document.body.style.height = '70%';
		this.DRAW_AREA.style.width = '100%';
		this.DRAW_AREA.style.position = 'absolute';
	};

	this.renderer = new THREE.WebGLRenderer({antialias: true});
	// �`��̈�̃T�C�Y���擾
	this.Width = this.DRAW_AREA.clientWidth;
	this.Height = this.DRAW_AREA.clientHeight;
	this.DRAW_AREA.appendChild(this.renderer.domElement);
	this.renderer.setSize(this.Width, this.Height);
	// �f�t�H���g�̔w�i�F�ƃ��l
	this.renderer.setClearColorHex(0xFFFFFF, 1.0);
	if(SHADOW == true){
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapSoft = true;
	}else{
		this.renderer.shadowMapEnabled = false;
		this.renderer.shadowMapSoft = false;
	};
};

/*
** FPS�̕\��
*/
function viewFPS(){
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	if(FULLSCREEN){
		this.stats.domElement.style.top = '5px';
		this.stats.domElement.style.left = '5px';
	}else{
		this.stats.domElement.style.top = '11%';
		this.stats.domElement.style.left = '5.5%';
	};
	DRAW_AREA.appendChild(this.stats.domElement);
};

/*
** ���J�����̐ݒ�
*/
function initCamera(posX, posY, posZ, tarX, tarY, tarZ) {
	var posX = posX || 0;
	var posY = posY || 0;
	var posZ = posZ || 0;
	var tarX = tarX || 0;
	var tarY = tarY || 0;
	var tarZ = tarZ || 0;
	// �������e�i��p, �A�X�y�N�g��, �\��������O�̌��E����, �\������鉜�̌��E�����j
	this.camera = new THREE.PerspectiveCamera(60, Width / Height, 1, 10000);
	// �J�����̈ʒu
	this.camera.position = new THREE.Vector3(posX, posY, posZ);
	// �J�����𓮂�����悤�ɂ���i2�ڂ̈����̓}�E�X���͂��󂯕t����div�v�f�j
	this.controls = new THREE.TrackballControls(this.camera, renderer.domElement);
	// �e��I�v�V����
	this.controls.noRotate = false;	// ��]�֎~
	this.controls.noZoom = false;	// �Y�[���֎~
	this.controls.noPan = false;		// ���s�ړ��֎~
	this.controls.dynamicDampingFactor = 0.3;	// ��]���̑��x�̌�����
	this.controls.minDistance = 0;	// �Y�[���C���ő�l
	this.controls.maxDistance = Infinity;	// �Y�[���A�E�g�ő�l

	// �����Ă������
	this.controls.target = new THREE.Vector3(tarX, tarY, tarZ)
};

/*
** ����ʏ�����
*/
function initScene() {
	this.scene = new THREE.Scene();
};

/*
** �������̐ݒ�
** �ꍇ�ɂ���Ď��s���낪�K�v
*/
function initLight() {
	// ���s����
	/* ���C�������ɔ������C�g���g���̂ŕK�v�Ȃ����A*/
	/* �V���h�[�}�b�s���O�͕��s���������Ή����ĂȂ��̂ō��ɂ��Ēu���Ƃ� */
	this.light = new THREE.DirectionalLight(0xffffff);
	this.light.position = new THREE.Vector3(0, 0, 0);
	
	// �V���h�[�}�b�s���O���s���ꍇ
	if(SHADOW == true){
		this.light.target.position.copy(scene.position);
		// �����������i��Ɋm�F�p�j
		// if(VISIBLE_LIGHT){
		// 	this.light.shadowCameraVisible = true;
		// }
		this.light.castShadow = true;
		// �����͈̔�
		this.light.shadowCameraLeft = -40;
		this.light.shadowCameraRight = 40;
		this.light.shadowCameraTop = -40;
		this.light.shadowCameraBottom = 40;
		this.light.shadowCameraNear = -50;
		this.light.shadowCameraFar = 50;
		this.light.shadowBias = -.001;
		// �e�̉𑜓x
		var resolution = 2048;
		this.light.shadowMapWidth = this.light.shadowMapHeight = resolution;
		// �e�̔Z��
		this.light.shadowDarkness = .7;
	};
	scene.add(this.light);
	
	// �����i�ʒu���w�肷��K�v�͂Ȃ��j
	this.amb = 0x666666;
	this.ambient = new THREE.AmbientLight(this.amb);
	scene.add(this.ambient);

	// �������C�g�i���C���̌����j
	this.Hemilight = new THREE.HemisphereLight(0xbbbbbb, this.amb);
	this.Hemilight.position = new THREE.Vector3(0, 0, 0);
	// scene.add(this.Hemilight);
};

//========================
// ��������̓e�N�X�`���Ɋւ���֐�
//========================

/*
** �e�N�X�`�����Z�b�g����֐�
** �f�t�H���g�̊֐��������Ėʓ|�Ȃ̂ō쐬
*/
function setTexture(url){
	var texture = new THREE.ImageUtils.loadTexture(url);
	return texture;
};

/*
** �����e�N�X�`�����쐬���ĕԂ��֐�
*/
function setCtxTexture(str, color, size, fonttype, bgsize, transparent){
	// �����ȗ������ꍇ�̃f�t�H���g�l
	this.str = str || 'Test';
	this.color = color || 0x666666;
	this.size = size || 65;
	this.fonttype = fonttype || '�l�r �o�S�V�b�N';
	this.bgsize = bgsize || 600;
	this.transparent = transparent || false;

	// ���Ɠ��l��16�i���̌`�ŐF���w��ł���悤�ɂ��邽�߂̏���
	var rgb = new String();
	this.color = this.color.toString(16);
	this.color = ('0000' + this.color).slice(-6);
	rgb = '#' + this.color;

	// canvas�v�f���擾
	var canvas = document.createElement('canvas');
	// �摜�̉𑜓x�ɑ���
	canvas.width = 256; canvas.height = 256;
	var ctx = canvas.getContext('2d');
	// �w�i�F���[���I�ɍ쐬�i�T�C�Y�ƈʒu�͓K���ɒ�������j
	if(!this.transparent){
		ctx.fillStyle = 'white';
		ctx.font = this.bgsize + 'px' + ' ' + '�l�r �o�S�V�b�N';;
		ctx.textAlign = 'center';
		ctx.fillText('��', canvas.width/2, canvas.height + this.bgsize/4);
	};
	// �����쐬
	ctx.fillStyle = rgb;
	ctx.font = this.size + 'px' + ' ' + this.fonttype;;
	ctx.textAlign = 'center';
	ctx.fillText(this.str, canvas.width/2, canvas.height/2 + this.size/3);
	// �e�N�X�`�����쐬
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};

// Blender�ǂݍ���
function loadBlender(filename, scale, x, y, z, rx, ry, rz){
	// �����w�肵�Ȃ��ꍇ�̃f�t�H���g�l
	var filename = filename;
	var scale = scale || 1;
	var x = x || 0;
	var y = y || 0;
	var z = z || 0;
	var rx = rx || 0;
	var ry = ry || 0;
	var rz = rz || 0;

	var geometry;
	var materials = [];
	this.callback = function(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		this.meshBlender = new THREE.SkinnedMesh(geometry, material);
		for(i=0; i<materials.length; i++){
			// ambient���S��0�ɂȂ�炵���̂ŃJ���[�̒l������
			materials[i].ambient = materials[i].color;
			materials[i].side = 2;
			// �A�j���[�V�������s����悤�ɂ���
			materials[i].morphTargets = true;
		};
		this.meshBlender.scale = new THREE.Vector3(scale, scale, scale);
		this.meshBlender.position = new THREE.Vector3(x, y, z);
		this.meshBlender.rotation.x = rx * Math.PI/180;
		this.meshBlender.rotation.y = ry * Math.PI/180;
		this.meshBlender.rotation.z = rz * Math.PI/180;
		this.meshBlender.castShadow = true;
		this.meshBlender.receiveShadow = true;
		// �ǂ̃t���[����\�����邩���w��
		// this.meshBlender.morphTargetInfluences[0] = 1;
		scene.add(this.meshBlender);
	};
	var loader = new THREE.JSONLoader();
	loader.load(filename, this.callback);
};

/*
** Blender�A�j���[�V�����̏���
*/
function BlenderAnimationPrepare(startframe, keyframes, duration){
	var anim = {	//�A�j���[�V�����p
		startframe: startframe, // �J�n�t���[��
		keyframes: keyframes,   // �J�n����I���܂ł̃t���[����
		duration: duration, // �A�j���[�V�����̎���[ms]
		interpolation: 0, // 1�t���[��������̎��ԁiFPS�̋t���j
		lastKeyframe: false,    // �O�t���[��
		currentKeyframe: true,	// ���݃t���[��
		move: false,	// �C���^���N�V�����p
	};
	anim.interpolation = anim.duration / anim.keyframes;
	return anim;
}

/*
** Blender�A�j���[�V�������[�v
** loadBlender��BlenderAnimationPrepare���Ɏ��s���Ă�������
*/
function BlenderAnimation(anim){
	var time = new Date().getTime() % anim.duration;
	var keyframe = Math.floor(time / anim.interpolation) + anim.startframe;
	if (keyframe != anim.currentKeyframe){
		meshBlender.morphTargetInfluences[anim.lastKeyframe] = false; // �O�t���[��
		meshBlender.morphTargetInfluences[anim.currentKeyframe] = true; // ���݃t���[��
		meshBlender.morphTargetInfluences[keyframe] = false; // ���t���[��
		anim.lastKeyframe = anim.currentKeyframe; // �O�t���[����1�t���[���X�V
		anim.currentKeyframe = keyframe; // ���݃t���[����1�t���[���X�V
	}
	meshBlender.morphTargetInfluences[keyframe] = 
		(time % anim.interpolation) / anim.interpolation;
	meshBlender.morphTargetInfluences[anim.lastKeyframe] = 
		1 - meshBlender.morphTargetInfluences[keyframe];
}

// obj�ǂݍ���
function loadSoccer(scale, x, y, z, rx, ry, rz){
	// �����w�肵�Ȃ��ꍇ�̃f�t�H���g�l
	var scale = scale || 1;
	var x = x || 0;
	var y = y || 0;
	var z = z || 0;
	var rx = rx || 0;
	var ry = ry || 0;
	var rz = rz || 0;

	var loader = new THREE.OBJLoader();
	var geometry;
	loader.load('./s06.obj', function(geometry) {
		this.meshSoccer = geometry;
		//�T�b�J�[�{�[��
		var c = this.meshSoccer.children[0].geometry.faces;
		for(i=0; i<c.length; i++){
			if(i<40){
				c[i].materialIndex = 0;	//�Z�p�`
			}else{
				c[i].materialIndex = 1;	//�܊p�`
			}
		}
		this.meshSoccer.children[0].material = new THREE.MeshFaceMaterial([
			new THREE.MeshLambertMaterial({ color:0xdddddd, side:2 }),
			new THREE.MeshLambertMaterial({ color:0x000000, side:2 })
		]);
        this.meshSoccer.scale = new THREE.Vector3(scale, scale, scale);
		this.meshSoccer.position = new THREE.Vector3(x, y, z);
		this.meshBlender.rotation = new THREE.Vector3(rx * Math.PI/180, ry * Math.PI/180, rz * Math.PI/180);
		// ����Ă邯�ǂȂ����e���o�Ȃ�
		this.meshSoccer.castShadow = true;
		this.meshSoccer.receiveShadow = true;
		scene.add(this.meshSoccer);
	});
};

//========================
// ��������̓{�^���ȂǂɊւ���֐�
//========================

/*
** �ꊇ���ăV�[������蒼���֐�
** �ėp���������Ċy�����ǎ኱�x��
*/
function updateScene() {
	if(SWITCH_SHADOW){
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
// ��������̓C�x���g�Ɋւ���֐�
//======================

/*
** �C�ӂ̗v�f�̃I�t�Z�b�g���擾����֐� �i�`��̈�̃I�t�Z�b�g�ʒu�擾�p�j
** �}�E�X���W�𐳂����擾���邽�߂ɕK�v
*/
function getElementPosition(element) {
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
	if(intersects.length == 0){
		intersects[0] = 0;
	}
	return intersects;
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