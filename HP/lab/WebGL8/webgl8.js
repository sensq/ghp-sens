var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var stats;
var baseTime = +new Date();

var img_nx	= './Bridge2/negx.jpg';
var img_ny	= './Bridge2/negy.jpg';
var img_nz	= './Bridge2/negz.jpg';
var img_px	= './Bridge2/posx.jpg';
var img_py	= './Bridge2/posy.jpg';
var img_pz	= './Bridge2/posz.jpg';
texture_nx	= new THREE.ImageUtils.loadTexture(img_nx);
texture_ny	= new THREE.ImageUtils.loadTexture(img_ny);
texture_nz	= new THREE.ImageUtils.loadTexture(img_nz);
texture_px	= new THREE.ImageUtils.loadTexture(img_px);
texture_py	= new THREE.ImageUtils.loadTexture(img_py);
texture_pz	= new THREE.ImageUtils.loadTexture(img_pz);

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight;	//div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//FPS�̕\��
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '57px';	//�ォ��̈ʒu
	document.getElementById('container').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(0, 0, 1);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	ambient = new THREE.AmbientLight(0xffffff);
	ambient.position = new THREE.Vector3(0, 0, 0);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	var materials = [
		new THREE.MeshLambertMaterial({map:texture_px,side:2}),
		new THREE.MeshLambertMaterial({map:texture_nx,side:2}),
		new THREE.MeshLambertMaterial({map:texture_py,side:2}),
		new THREE.MeshLambertMaterial({map:texture_ny,side:2}),
		new THREE.MeshLambertMaterial({map:texture_pz,side:2}),
		new THREE.MeshLambertMaterial({map:texture_nz,side:2})
	];
	material = new THREE.MeshFaceMaterial(materials);
	geometry = new THREE.CubeGeometry(100, 100, 100);
	
	mesh = new THREE.Mesh(geometry, material);
	
	scene.add(mesh);
}

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	
	renderer.render(scene, camera);
	mesh.rotation.y = 0.3 * ( baseTime + Date.now()) / 1000; //��]
}

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initStats();
	initObject();
	renderer.clear();
	render();
}

//�������猩��
function Button_inside() {
	camera.position = new THREE.Vector3(0, 0, 1);
	renderer.clear();
	render();
}

//�O�����猩��
function Button_outside() {
	camera.position = new THREE.Vector3(200, 0, 0);
	renderer.clear();
	render();
}

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );

//�t�H�[�J�X�����킹��
window.addEventListener('load', function (){
	var checks=document.getElementsByName("Button_Startstop");
	checks[0].checked=false;
	
	checks[0].focus(); // �J�[�\�������킹�� 
}, false);
