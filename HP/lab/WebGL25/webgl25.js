document.write('<script type="text/javascript" src="./myTemplate.js" charset="utf-8"></script>');
document.write('<script type="text/javascript" src="./SphericalHarmonics.js" charset="utf-8"></script>');

var r = 15;
var l = 3;
var m = 1;
var slice = 70;
var stack = 70;

function showValue() {
	// �l��\��
	document.getElementById("para_r").value = document.getElementById("range0").value;
	document.getElementById("para_l").value = document.getElementById("range1").value;
	document.getElementById("para_m").value = document.getElementById("range2").value;
	document.getElementById("slice").value = document.getElementById("range3").value;
	document.getElementById("stack").value = document.getElementById("range4").value;
}

function setParameter() {
	// �l����
	r = Number(document.getElementById("range0").value);
	l = Number(document.getElementById("range1").value);
	m = Number(document.getElementById("range2").value);
	slice = Number(document.getElementById("range3").value);
	stack = Number(document.getElementById("range4").value);
	// l�ɍ��킹��m�͈̔͂�ύX
	document.getElementById("range2").min = -l;
	document.getElementById("range2").max = l;

	// �G���[����
	if (m > l) {
		m = l;
		document.getElementById("range2").value = l;
	}
	else if (m < -l) {
		m = -l;
		document.getElementById("range2").value = -l;
	}

	// �l��\��
	showValue();

	// �ĕ`��
	set();
}

function set() {
	delete stats;
	viewFPS();
	initScene();
	initLight();
	initObject();
	renderer.clear();
}

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	renderer.setClearColorHex(0x000000, 1.0);

	var mode = document.getElementById('mode').checked;
	var wire = document.getElementById('wire').checked;
	var color = [];
	color[0] = document.getElementById('range_r').value;
	color[1] = document.getElementById('range_g').value;
	color[2] = document.getElementById('range_b').value;
	var mesh = drawBasisSH(r, l, m, slice, stack, 1, 1, wire, mode, color);
	scene.add(mesh);

	// ����
	light.color.setHex(0x505050);
	ambient.color.setHex(0x202020);
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//�}�E�X����p

	renderer.render(scene, camera);
};

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera(10, 9, 0);	// �J����������
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
var updateObject = function () { };

//===========================
// ��������͂��̑��̃C�x���g�Ɋւ���L�q
//===========================

/*
** �}�E�X�ړ����̃C�x���g
*/
document.addEventListener('mousemove', function (e) {
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
document.addEventListener('click', function (e) {
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
document.onkeydown = function (e) {
	// ���������L�[�̃L�[�R�[�h���擾 
	var keycode = e.which;
	if (keycode >= 48 & keycode <= 90) {
		// 48~90�i0~9, a~z�j�̏ꍇ�͕����ɕϊ�
		keycode = String.fromCharCode(keycode).toUpperCase();
	};
	switch (keycode) {
		case "Z":
			changeScreen();
			break;
	};
};

/*
** �e�L�X�g���Ȃǂ̃f�t�H���g�l���
*/
window.addEventListener('load', function () {
	document.getElementById("mode").checked = false;
	document.getElementById("wire").checked = false;

	document.getElementById("para_r").value = 15;
	document.getElementById("para_l").value = 3;
	document.getElementById("para_m").value = 1;
	document.getElementById("slice").value = 70;
	document.getElementById("stack").value = 70;
	document.getElementById("range0").value = 15;
	document.getElementById("range1").value = 3;
	document.getElementById("range2").value = 1;
	document.getElementById("range3").value = 70;
	document.getElementById("range4").value = 70;

	document.getElementById("range2").min = -document.getElementById("range1").value;
	document.getElementById("range2").max = document.getElementById("range1").value;
}, false);
