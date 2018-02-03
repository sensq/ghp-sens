document.write('<script type="text/javascript" src="./myTemplate.js"></script>');

// �O���[�o���ϐ�
var collision = false;

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	sky = new myObj.skyboxSphere();
	scene.add(sky);
	floor = new myObj.segmentPlane(50, 50);
	scene.add(floor.mesh);
	floor.mesh.rotation.x = Math.PI/180*90;
	floor.mesh.position.y = -1.01;

	loadBlender("move.js");
	anim = BlenderAnimationPrepare(0, 80, 2000)
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//�}�E�X����p

	if(collision){
		anim.move = true;
	}else{
		controls.target = meshBlender.position;
		anim.move = false;
		if (keyboard.pressed("up")){
			meshBlender.translateZ(-0.2);
			anim.move = true;
		}
		if (keyboard.pressed("down")){
			meshBlender.translateZ(0.2);
			anim.move = true;
		}
		if (keyboard.pressed("left")){
			meshBlender.rotation.y += Math.PI/180*5;
			anim.move = true;
		}
		if (keyboard.pressed("right")){
			meshBlender.rotation.y -= Math.PI/180*5;
			anim.move = true;
		}
	}

	// Blender�A�j���[�V����
	if (meshBlender && anim.move){
		BlenderAnimation(anim)
	}

	// ����
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		30+radius * Math.sin(omega * 0.5 * Math.PI / 180),
		10,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;

	renderer.render(scene, camera);
};

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera(18, 7, 9);	// �J����������
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
** �ʂɃC�x���g�����s����֐����W�߂��N���X
*/
var updateObject = function (){};
updateObject.move = function(){
	scene.remove(meshBlender)
	loadBlender("move.js");
	collision = false;
	anim = BlenderAnimationPrepare(0, 80, 2000)
}
updateObject.collision = function(){
	initCamera(18, 7, 9)
	scene.remove(meshBlender)
	loadBlender("collision.js", 1, 0, -0.2);
	// meshBlender.position.y = 30;
	collision = true;
	anim = BlenderAnimationPrepare(0, 200, 6000)
}

//===========================
// ��������͂��̑��̃C�x���g�Ɋւ���L�q
//===========================

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
** �e�L�X�g���Ȃǂ̃f�t�H���g�l���
*/
window.addEventListener('load', function() {
}, false);