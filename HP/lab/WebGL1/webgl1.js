var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = +new Date();

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth; //div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight; //div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(100, 20, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera,canvas);
}

//��ʏ�����
function initScene() {
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);
	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	geometry = new THREE.TorusGeometry(30, 10, 20, 40);
	material = new THREE.MeshPhongMaterial({
		color: 0xff9900,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		metal: true
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update(); //�}�E�X����p
	mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //��]
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

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

//�t�H�[�J�X�����킹��
window.addEventListener('load', function (){
	var element = document.getElementById("dummy"); 
	element.focus();
}, false);
