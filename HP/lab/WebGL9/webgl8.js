var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;
var flag = true;

var img = './ika2.png';
texture = new THREE.ImageUtils.loadTexture(img);

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight;	//div�v�f�̃T�C�Y���擾 
	
	renderer = new THREE.WebGLRenderer({
		clearColor: 0x000000,
		clearAlpha: 1,
		antialias: false
	});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	
	renderTarget = new THREE.WebGLRenderTarget(256, 256, {
		magFilter: THREE.NearestFilter,
		minFilter: THREE.NearestFilter,
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping
	});
};

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(60, 0, 0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
	controls.enabled = false;
	
	subCamera = new THREE.PerspectiveCamera(60, renderTarget.width / renderTarget.height, 0.1, 5000);
	subCamera.position.z = 6;
	subControls = new THREE.TrackballControls( subCamera , canvas);
	subControls.enabled = true;
}

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
	subScene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0x333333);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
	
	subLight1 = new THREE.DirectionalLight(0xffffff);
	subLight1.position = new THREE.Vector3(0.0, 0.0, 1.0);
	subScene.add(subLight1);
	subLight2 = new THREE.DirectionalLight(0xffffff);
	subLight2.position = new THREE.Vector3(0.0, 1.0, 0.0);
	subScene.add(subLight2);
	subLight3 = new THREE.DirectionalLight(0xffffff);
	subLight3.position = new THREE.Vector3(1.0, 0.0, 0.0);
	subScene.add(subLight3);
	subLight4 = new THREE.DirectionalLight(0xffffff);
	subLight4.position = new THREE.Vector3(0.0, 0.0, -1.0);
	subScene.add(subLight4);
	subLight5 = new THREE.DirectionalLight(0xffffff);
	subLight5.position = new THREE.Vector3(0.0, -1.0, 0.0);
	subScene.add(subLight5);
	subLight6 = new THREE.DirectionalLight(0xffffff);
	subLight6.position = new THREE.Vector3(-1.0, 0.0, 0.0);
	subScene.add(subLight6);
	
	subambient = new THREE.AmbientLight(0xffffff);
	scene.add(subambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	//mesh = new THREE.Mesh(new THREE.TeapotGeometry(15, 20, 1, 0, 1, 1, 1), new THREE.MeshLambertMaterial({
	mesh = new THREE.Mesh(new THREE.CubeGeometry(35, 35, 35), new THREE.MeshLambertMaterial({
	  color: 0xffffff,
	  side: 2,
	  map: renderTarget
	}));
	scene.add(mesh);

	subMesh = new THREE.Mesh(new THREE.CubeGeometry(10,10,10), new THREE.MeshLambertMaterial({
	  color: 0xffffff,
	  side: 1,
	  map: texture
	}));
	
	subScene.add(subMesh);
}

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	subControls.update();	//�}�E�X����p
	renderer.render(subScene, subCamera, renderTarget);
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

//���[�h�؂�ւ��{�^��
function mode() {
	//�`�F�b�N��ԕω��p
	var checks=document.getElementsByName("mode");
	
	if(flag == false){
		flag = true;
		checks[0].checked=true;
		subControls.enabled = true;
		controls.enabled = false;
	}
	else if(flag == true){
		flag = false; 
		checks[0].checked = false;
		controls.enabled = true;
		subControls.enabled = false;
	}
}

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

document.onkeydown = function(e) { 
	// �L�[�R�[�h�̕������擾 
	keychar = String.fromCharCode(e.which).toUpperCase();
	
	if (keychar == "Q") { 
		mode();
	} else if (keychar == "W") { 
	}
}

//�X�V���Ƀ`�F�b�N�{�b�N�X�̃`�F�b�N���O��
window.addEventListener('load', function (){
	var checks=document.getElementsByName("mode");
	checks[0].checked=true;
	
	checks[0].focus(); // �J�[�\�������킹�� 
}, false);
