document.write('<script type="text/javascript" src="./myTemplate.js" charset="utf-8"></script>');

var composer;
var texture;
var sprite;
var infoImg = {width:1, height:2};

/*
** ���I�u�W�F�N�g�̐ݒ�
** ��{�I�ɂ��������C���ɏ��������Ă���
*/
function initObject() {
	// �X�J�C�{�b�N�X�Ə�
	var sky = new myObj.skyboxCube();
	// scene.add(sky);

	var amb = 0xffffff;
	var ambient = new THREE.AmbientLight(amb);
	scene.add(ambient);

	texture = setTexture("miku.jpg");
	var geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		ambient: 0xffffff,
		specular: 0xffffff,
		emissive: 0x000000,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture,
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	var materialS = new THREE.SpriteMaterial({map: texture, color: 0xFFFFFF});
	sprite = new THREE.Sprite(materialS);
	var w = texture.image.width;
	var h = texture.image.height;

	document.getElementById("draw_area").style.width = w + "px";
	document.getElementById("draw_area").style.height = h + "px";
	renderer.setSize(w, h);
	camera2d.right = w;
	camera2d.bottom = h;
	camera2d.updateProjectionMatrix();

	sprite.material.map = texture;
	sprite.position.set(w*0.5, h*0.5, -9999);
	sprite.scale.set(w, -h, 1);
	scene.add(sprite);


	// �|�X�g�v���Z�X�̐ݒ�
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));
	composer.addPass(new THREE.RenderPass(scene2d, camera2d));

	// �I���W�i���̃|�X�g�v���Z�X��ǉ�
	composer.addPass(new THREE.ShaderPass({
		vertexShader: document.getElementById('vshader').textContent,
		fragmentShader: document.getElementById('fshader').textContent,
		uniforms: { tDiffuse: { type:"t", value:null } },
	}));

	var toScreen = new THREE.ShaderPass(THREE.CopyShader);
	toScreen.renderToScreen = true;
	composer.addPass(toScreen);
};

/*
** �������_�����O
** �A�j���[�V�����͂����ɏ���
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//�}�E�X����p
	controls2d.update();	//�}�E�X����p

	composer.render();

	keyControl();
	// renderer.render(scene, camera);
};

/*
** �L�[�{�[�h����
*/
function keyControl(){
	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
	}

	// �����X����
	if (keyboard.pressed("left")){
	}
	if (keyboard.pressed("right")){
	}
}

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera(0, 0, 1);	// �J����������
	initScene();	// �V�[��������
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

		case "R":
		camera.position = new THREE.Vector3(0, 0, 1);
		camera.up = new THREE.Vector3(0, 1, 0);
		break;
	};
};


// �h���b�O���h���b�v�œǂݍ���
function onDropFile(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = {name:name[1], type:name[2], size:img.size};
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			tmpImg = new Image();
			tmpImg.src = e.target.result;
			tmpImg.onload = function() {
				texture = setTexture(e.target.result);
				var w = texture.image.width;
				var h = texture.image.height;
				var property = "NAME�w" + img.name + 
					"�x, SIZE�w" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)�x�@" + 
					w + "x" + h;
				document.getElementById('list').innerHTML = property;

				if($("#3D:checked").val()){
					camera.position = new THREE.Vector3(0, 0, 10);
					mesh.material.map = texture;
					if(w > h){
						mesh.scale.x = 1;
						mesh.scale.y = h/w;
					}else{
						mesh.scale.x = w/h;
						mesh.scale.y = 1;
					}
				}
				if($("#2D:checked").val()){
					document.getElementById("draw_area").style.width = w + "px";
					document.getElementById("draw_area").style.height = h + "px";
					renderer.setSize(w, h);
					camera2d.right = w;
					camera2d.bottom = h;
					camera2d.updateProjectionMatrix();

					sprite.material.map = texture;
					sprite.position.set(w*0.5, h*0.5, -9999);
					sprite.scale.set(w, -h, 1);
					scene.add(sprite);
				}
			}
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

function resize(w, h){
}

 // �f�t�H���g�������L�����Z��
function�@onCancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
};

/*
** �e�L�X�g���Ȃǂ̃f�t�H���g�l���
*/
window.addEventListener('load', function() {
	// �h���b�O���h���b�v�ɑΉ�
	document.getElementById("center").addEventListener("dragover", onCancel, false);
	document.getElementById("center").addEventListener("dragenter", onCancel, false);
	document.getElementById("center").addEventListener("drop", onDropFile, false);
}, false);