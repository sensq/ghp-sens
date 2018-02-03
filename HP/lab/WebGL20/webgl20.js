document.write('<script type="text/javascript" src="./myTemplate.js"></script>');

// �O���[�o���ϐ�

//�J�����̐ݒ�
function originalCamera() {
	camera = new THREE.PerspectiveCamera(45 , Width / Height , 1 , 10000);
	camera.position = new THREE.Vector3(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera , renderer.domElement);
	controls.noPan = true;
}

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	// ����
	plane = new myObj.segmentPlane(10, 10);
	scene.add(plane.mesh)
	plane.mesh.position.x = -20;
	plane.mesh.rotation.x = -Math.PI/180*60;
	plane.mesh.rotation.y = Math.PI/180*30;
	for(j=0; j<10; j++){
		for(i=0; i<10; i++){
			if(i%2 == j%2)
				plane.change(i, j, 0x0033bb);
			else
				plane.change(i, j, 0xffff00);
		}
	}

	// �L���[�u
	cube = new myObj.segmentCube(6, 6, 6, 5, 5, 5);
	scene.add(cube.mesh)
	cube.mesh.rotation.x = Math.PI/180*30;
	cube.mesh.rotation.y = -Math.PI/180*30;

	for(k=0; k<6; k++){
		for(j=0; j<5; j++){
			for(i=0; i<5; i++){
				if(i%2 == j%2)
					cube.change(k, i, j, 0x990000);
				else
					cube.change(k, i, j, 0x009999);
			}
		}
	}

	// �X�t�B�A
	sphere = new segmentSphere(5, 30, 30, 0x9900cc);
	scene.add(sphere.mesh)
	sphere.mesh.position.x = 20;
	for(j=0; j<30; j++){
		for(i=0; i<30; i++){
			var rcolor = 0x666666 + 0x999999*Math.random();
			if(i%2 == j%2)	
				sphere.change(i, j, 0x000000);
			else
				sphere.change(i, j, rcolor);
		}
	}

	sky = new myObj.skyboxSphere();
	scene.add(sky)
	dat_gui();
};

/*
** dat.gui�̍쐬
*/
function dat_gui(){
	// �e�L�X�g�{�b�N�X����擾
	var color = document.getElementById('clickColor').value;
	color = color.replace("0x", "#");
	var parameters = {color: color};
	var gui = new dat.GUI();
	var clickColor = gui.addColor(parameters, 'color').name("�p���b�g").listen();
	clickColor.onChange(function(value){
		color = value.replace("#", "0x");
		// ��U�e�L�X�g�{�b�N�X�ɕۑ�
		document.getElementById('clickColor').value = color;
	});
	gui.open();
	// �d�����Ȃ��悤�ɂ��邽�߂̏���
	// �l��html�̍\���ɂ���ď���������
	if(FULLSCREEN){
		// dat.gui�����ɑ��݂��Ă�����폜�i�t���X�N���[�������j
		var element = document.body;
	 	if(element.childNodes.length == 17){	// ���[�J������5, �l�b�g����17�H
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui������
		var element = document.getElementById('datgui');
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
		var element = document.getElementById('datgui');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// �ő剻����dat.gui������
		var element = document.body;
	 	if(element.childNodes.length == 17){	// ���[�J������5, �l�b�g����17�H
	 		element.removeChild(element.childNodes[16]);
	 	};
		// �ʏ펞��dat.gui�̈ʒu����
		// gui.domElement.style.position = 'relative';
		// gui.domElement.style.height = '140px';
		document.getElementById('datgui').appendChild(gui.domElement);
	};
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	stats.update();

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
	originalCamera();	// �J����������
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
** �{�^���ނł̃C�x���g�͂ł��邾���������ŏ���
*/
var updateObject = (function (){
	this.meshSelect = function(number){
		var mesh;
		switch(number) {
			case 0:
				mesh = plane.mesh;
			break;
			case 1:
				mesh = cube.mesh;
			break;
			case 2:
				mesh = sphere.mesh;
			break;
		}
		return mesh;
	}
	this.cameraTarget = function(mesh){
		this.mesh = meshSelect(document.getElementById('cameraTarget').selectedIndex);
		controls.target = this.mesh.position;
	}
	this.black = function(){
		this.mesh = meshSelect(document.getElementById('black').selectedIndex);
		for(var i=0; i<mesh.geometry.faces.length; i++){
			this.mesh.geometry.faces[i].color.setHex(0x000000);
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	this.random = function(){
		this.mesh = meshSelect(document.getElementById('random').selectedIndex);
		if(!document.getElementById('tri').checked){
			for(var i=0; i<mesh.geometry.faces.length-1; i+=2){
				var rcolor = Math.random()*0xffffff;
				this.mesh.geometry.faces[i].color.setHex(rcolor);
				this.mesh.geometry.faces[i+1].color.setHex(rcolor);
			}
		}else{
			for(var i=0; i<mesh.geometry.faces.length; i++){
				var rcolor = Math.random()*0xffffff;
				this.mesh.geometry.faces[i].color.setHex(rcolor);
			}
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	return this;
})();

//===========================
// ��������͂��̑��̃C�x���g�Ɋւ���L�q
//===========================

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
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

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
	var color = document.getElementById('clickColor').value;

	// ���N���b�N�ŐF��ς���
	if(e.button == 0 && e.target.tagName === "CANVAS"){
		if(intersects[0].object != sky){
			var face = intersects[0].faceIndex;
			if(face%2){
				intersects[0].object.geometry.faces[face].color.setHex(color);
				intersects[0].object.geometry.faces[face-1].color.setHex(color);
			}else{
				intersects[0].object.geometry.faces[face].color.setHex(color);
				intersects[0].object.geometry.faces[face+1].color.setHex(color);
			}
			intersects[0].object.geometry.colorsNeedUpdate = true;
		}
	}
	// �E�N���b�N�ŃJ����
	if(e.button == 2 && e.target.tagName === "CANVAS"){
		if(intersects[0].object != sky){
			controls.target = intersects[0].object.position;
		}
	}
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
	document.getElementById('clickColor').value = "0xff0000";
}, false);