document.write('<script type="text/javascript" src="./myTemplate.js" charset="Shift_JIS"></script>');

var Horizon = 18;	// ���̉���
var Vertical = 20;	// ���̏c��
var Num = 0;		// ���݉�ʓ��ɂ���e��
var MaxNum = 3;		// ��ʓ��ɏo����ő�e��
var Speed = 100;	// ���@1�}�X�ړ��ɂ����鎞��[ms]�i�������قǑ����j
var MSpeed = 800;	// �~�T�C����������܂ł̎���[ms]�i�������قǑ����j

// �ꎞ�I�ȕϐ�
var moving = true;	// �ړ��A�j���[�V�����̏d����h��
var score = 0;
var red = 0;
var yellow = 0;
var timer = 0;
var startTime;
var goalTime = 0;

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	// �X�J�C�{�b�N�X�Ə�
	var sky = new myObj.skyboxSphere();
	scene.add(sky);
	floor = new myObj.segmentPlane(Vertical, Horizon);
	scene.add(floor.mesh);
	floor.mesh.material.color.setHex(0xbbbbbb);
	floor.mesh.rotation.x = Math.PI/180*90;
	floor.mesh.receiveShadow = true;
	// ���@
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: 0x00cccc,
		map: setCtxTexture("��", 0x333333, 200)
	});
	player = new THREE.Mesh(geometry, material);
	player.position = new THREE.Vector3(3.5, 0.5, 0.5);
	player.rotation.z = Math.PI/180*90;
	scene.add(player);
	// �G
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xcc0000,
		map: setCtxTexture("�G", 0x333333, 200)
	});
	enemy = new THREE.Mesh(geometry, material);
	enemy.position = new THREE.Vector3(-4.5, 0.5, 3.5);
	enemy.rotation.y = Math.PI/180*90;
	scene.add(enemy);
	// ���A�G
	geometry = new THREE.CubeGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({
		color: 0xcccc00,
		map: setCtxTexture("�ꂠ", 0x333333, 100)
	});
	rare = new THREE.Mesh(geometry, material);
	rare.position = new THREE.Vector3(Horizon, 0.5, 0.5);
	rare.rotation.y = Math.PI/180*90;
	// �G���[�h�~�p�̃_�~�[
	missile = [];
	geometry = new THREE.CubeGeometry(0.6, 0.2, 0.2);
	material = new THREE.MeshPhongMaterial({
		color: 0x666666
	});
	for(var i=0; i<MaxNum; i++){
		missile.push(new THREE.Mesh(geometry, material));
	}
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//�}�E�X����p
	if(timer != 0){
		if(timer == 1){
			timer++;
			startTime = new Date();
		}
		var tempTime = new Date();
		goalTime = ((tempTime.getTime() - startTime.getTime())/1000).toFixed(2);
	}
	// ���_
	if(document.getElementById('1st').checked){
		camera.position.x = player.position.x;
		camera.position.y = player.position.y;
		camera.position.z = player.position.z;
		var target = new THREE.Vector3(player.position.x-5, player.position.y+1, player.position.z);
		camera.lookAt(target);
	}else if(document.getElementById('3rd').checked){
		camera.position.x = player.position.x+3;
		camera.position.y = player.position.y+2;
		camera.position.z = player.position.z;
		var target = new THREE.Vector3(player.position.x-5, player.position.y+1, player.position.z);
		camera.lookAt(target);
	}else if(document.getElementById('hukan').checked){
		camera.position.x = 11;
		camera.position.y = 10;
		camera.position.z = 0;
		var target = new THREE.Vector3(2, 0, 0);
		camera.lookAt(target);
	}

	// ����
	Hemilight.position = new THREE.Vector3(20, 20, 0);
	light.position = Hemilight.position;

	// �^�C���ƃX�R�A�̕\��
	document.getElementById('time').value = goalTime;
	document.getElementById('score').value = score;
	document.getElementById('red').value = red;
	document.getElementById('yellow').value = yellow;
	// �I��
	if(parseInt(goalTime) == 30){
		var result = "";
		result = score + "�_�I";
		// �ō��L�^��ێ�
		if(score > document.getElementById('record').value){
			document.getElementById('record').value = score;
		}
		timer = 0;
		goalTime = 0;
		alert(result)
		score = 0;
		red = 0;
		yellow = 0;
	}

	keyControl();
	renderer.render(scene, camera);
};

/*
** �L�[�{�[�h����
*/
function keyControl(){
	function move(direct){
		moving = false;
		// �ړ��Ɖ�]
		var tween = new TWEEN.Tween({ z:player.position.z, rotation:player.rotation.x });
			if(direct == "left"){
				tween.to( { z:player.position.z+1, rotation: player.rotation.x+Math.PI/180*90}, Speed );
			}else if(direct == "right"){
				tween.to( { z:player.position.z-1, rotation: player.rotation.x-Math.PI/180*90}, Speed );
			}
			tween.easing(TWEEN.Easing.Linear.None);
			tween.onUpdate(function () {
				switch(direct){
					case "left":
					player.rotation.x = this.rotation;
					player.position.z = this.z;
					break;
					case "right":
					player.rotation.x = this.rotation;
					player.position.z = this.z;
					break;
				}
				if(document.getElementById('rush').checked){
					Speed = 20;
					MSpeed = 2000;
					fire();
				}else{
					Speed = 100;
					MSpeed = 800;
				}
			});
			tween.onComplete(function(){
				moving = true;
			});
			tween.start();
	}

	// ���˃A�j���[�V����
	function fire(){
		if(timer == 0){
			timer++;	// �^�C�}�[���쓮�����邽�߂̏���
		}
		var geometry = new THREE.CubeGeometry(0.6, 0.2, 0.2);
		var material = new THREE.MeshPhongMaterial({
			color: 0x666666
		});
		missile[Num] = new THREE.Mesh(geometry, material);
		var currentMissile = missile[Num];
		scene.add(currentMissile);
		Num++;
		var missilePos = {x:player.position.x, y:0.5, z:player.position.z};
		currentMissile.position.y = missilePos.y;
		currentMissile.position.z = missilePos.z;
		var tween = new TWEEN.Tween(missilePos);
		tween.to( { x:-Vertical/2}, MSpeed );
		tween.easing(TWEEN.Easing.Linear.None);
		tween.onUpdate(function () {
			player.material.emissive.setHex(0x555555);	// ���˒��͔���
			currentMissile.position.x = missilePos.x;

			// ������������
			if(enemy.position.x-0.5 <= parseInt(currentMissile.position.x) && enemy.position.x+0.5 >= parseInt(currentMissile.position.x) && parseInt(enemy.position.z) == parseInt(currentMissile.position.z)){
				score++;
				red++;
				// ���������������
				scene.remove(enemy);
				scene.remove(currentMissile);
				currentMissile.position.z = Vertical;
				var p = Math.random();
				// �Ĕz�u
				enemy.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
				enemy.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
				scene.add(enemy);
				if(p < 0.25){
					// ���A�G�z�u
					scene.remove(enemy);
					rare.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
					rare.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
					scene.add(rare);
				}
			}

			// �������������i���A�G�j
			if(rare.position.x-0.5 <= parseInt(currentMissile.position.x) && rare.position.x+0.5 >= parseInt(currentMissile.position.x) && parseInt(rare.position.z) == parseInt(currentMissile.position.z)){
				score += 3;
				yellow++;
				// ���������������
				scene.remove(rare);
				scene.remove(currentMissile);
				rare.position.x = Horizon;
				currentMissile.position.z = Vertical;
				// �Ĕz�u
				enemy.position.x = parseInt(Math.random()*Vertical/2 - Vertical/2)+0.5;
				enemy.position.z = parseInt(Math.random()*(Horizon-1) - Horizon/2)+0.5;
				scene.add(enemy);
			}
		});
		tween.onComplete(function(){
			Num--;
			player.material.emissive.setHex(0x000000);
			scene.remove(currentMissile);
			currentMissile = null;
			missile.shift();
		});
		tween.start();
	}
	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
	}

	if (keyboard.pressed("left")){
		if(moving�@&& player.position.z < (Horizon/2-0.5)){
			move("left");
			animate();
		}
	}
	if (keyboard.pressed("right")){
		if(moving�@&& player.position.z > -(Horizon/2-0.5)){
			move("right");
			animate();
		}
	}
	if (keyboard.pressed("space")){
		if(Num < MaxNum){
			fire();
			animate();
		}
	}
}

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera(10, 9, 0, 2);	// �J����������
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
	// ���������L�[�̃L�[�R�[�h���擾 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90�i0~9, a~z�j�̏ꍇ�͕����ɕϊ�
		keycode = String.fromCharCode(keycode).toUpperCase();
	};
	switch(keycode){
		case "Z":
		changeScreen();
		break;
	};
};

/*
** �e�L�X�g���Ȃǂ̃f�t�H���g�l���
*/
window.addEventListener('load', function() {
	document.getElementById('rush').checked = false;
}, false);